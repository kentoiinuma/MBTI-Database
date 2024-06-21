module Api
  module V1
    class OgpController < ActionController::Base
      include ActionView::Layouts
      include ActionView::Rendering

      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

      def show
        @post = Post.find(params[:id])
        @media_works = @post.media_works

        Rails.logger.info "Post: #{@post.inspect}"
        Rails.logger.info "Media Works: #{@media_works.inspect}"

        @media_works.each do |work|
          Rails.logger.info "Original Image URL: #{work.image}"
          work.image = clean_image_url(work.image)
          Rails.logger.info "Cleaned Image URL: #{work.image}"
        end

        begin
          html = render_to_string(
            template: 'api/v1/ogp/show',
            layout: false,
            locals: { media_works: @media_works, post: @post }
          )
          Rails.logger.info "Generated HTML: #{html.inspect}"
        rescue => e
          Rails.logger.error "Error rendering template: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'Failed to render template', details: e.message }, status: :internal_server_error
          return
        end

        if html.blank?
          Rails.logger.error "Generated HTML is blank"
          render json: { error: 'Failed to generate OGP image' }, status: :internal_server_error
          return
        end

        begin
          kit = IMGKit.new(html, height: 630, width: 1200, quality: 100)
          Rails.logger.info "IMGKit options: #{kit.options}"
          img = kit.to_img(:png)
          Rails.logger.info "Generated image size: #{img.bytesize} bytes"

          file = Tempfile.new(['ogp', '.png'])
          file.binmode
          file.write(img)
          file.rewind

          response = Cloudinary::Uploader.upload(file.path, public_id: "ogp_image_#{@post.id}")
          Rails.logger.info "Cloudinary response: #{response.inspect}"

          ogp_image = OgpImage.find_or_initialize_by(post: @post)
          ogp_image.update!(image_url: response['secure_url'])

          render json: { ogp_image_url: ogp_image.image_url }, status: :ok
        rescue => e
          Rails.logger.error "Error generating OGP image: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'Failed to generate OGP image', details: e.message }, status: :internal_server_error
        ensure
          file.close
          file.unlink
        end
      end

      def page
        @post = Post.find(params[:id])
        @user = @post.user
        @media_works = @post.media_works
        @ogp_image = @post.ogp_image

        Rails.logger.info "Rendering OGP page for post: #{@post.id}, user: #{@user.username}"
        render layout: false
      end

      private

      def record_not_found
        render json: { error: 'Record not found' }, status: :not_found
      end

      def clean_image_url(url)
        cleaned_url = url.to_s.gsub(/[^\x20-\x7E]/, '')
        Rails.logger.info "Cleaned URL: #{cleaned_url}"
        cleaned_url
      end
    end
  end
end
