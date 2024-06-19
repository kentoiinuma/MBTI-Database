module Api
  module V1
    class OgpController < ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

      def show
        begin
          @post = Post.find(params[:id])
          @media_works = @post.media_works

          Rails.logger.info "Post: #{@post.inspect}"
          Rails.logger.info "Media Works: #{@media_works.inspect}"

          if @media_works.empty?
            Rails.logger.warn "Media Works is empty"
          end

          # 画像URLをクリーニング
          @media_works.each do |work|
            Rails.logger.info "Original Image URL: #{work.image}"
            work.image = clean_image_url(work.image)
            Rails.logger.info "Cleaned Image URL: #{work.image}"
          end

          # テンプレートに渡される変数の内容をログに出力
          Rails.logger.info "Locals for template: { media_works: #{@media_works.inspect} }"

          # テンプレートに変数を渡してHTMLを生成
          html = render_to_string(template: 'api/v1/ogp/show', layout: false, locals: { media_works: @media_works })
          Rails.logger.info "Generated HTML: #{html}"

          if html.blank?
            Rails.logger.error "Generated HTML is blank"
            render json: { error: 'Failed to generate OGP image' }, status: :internal_server_error
            return
          end

          kit = IMGKit.new(html, width: 1200, height: 630, quality: 100)
          Rails.logger.info "IMGKit options: #{kit.options.inspect}"
          image = kit.to_img(:png)

          if image.blank?
            Rails.logger.error "Generated image is blank"
            render json: { error: 'Failed to generate OGP image' }, status: :internal_server_error
            return
          end

          response = Cloudinary::Uploader.upload(image, public_id: "ogp_image_#{@post.id}")
          Rails.logger.info "Cloudinary upload response: #{response.inspect}"

          ogp_image = OgpImage.create(post: @post, image_url: response['secure_url'])
          Rails.logger.info "OgpImage creation response: #{ogp_image.inspect}"

          send_data(image, type: 'image/png', disposition: 'inline')
        rescue => e
          Rails.logger.error "Error generating OGP image: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: 'Failed to generate OGP image' }, status: :internal_server_error
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
        cleaned_url = url.gsub("\u0000", "")
        Rails.logger.info "Cleaned URL: #{cleaned_url}"
        cleaned_url
      end
    end
  end
end
