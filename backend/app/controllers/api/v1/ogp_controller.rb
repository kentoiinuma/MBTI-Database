module Api
  module V1
    class OgpController < ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

      def show
        begin
          @post = Post.find(params[:id])
          @media_works = @post.media_works
          @user = @post.user

          Rails.logger.info "Post: #{@post.inspect}"
          Rails.logger.info "Media Works: #{@media_works.inspect}"
          Rails.logger.info "User: #{@user.inspect}"

          html = render_to_string(template: 'ogp/show', layout: false)
          Rails.logger.info "Generated HTML: #{html}"

          kit = IMGKit.new(html, quality: 100)
          image = kit.to_img(:png)

          response = Cloudinary::Uploader.upload(image, public_id: "ogp_image_#{@post.id}")
          Rails.logger.info "Cloudinary upload response: #{response.inspect}"

          ogp_image = OgpImage.create(post: @post, image_url: response['secure_url'])
          Rails.logger.info "OgpImage creation response: #{ogp_image.inspect}"

          send_data(image, type: 'image/png', disposition: 'inline')
        rescue => e
          Rails.logger.error "Error generating OGP image: #{e.message}"
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
    end
  end
end
