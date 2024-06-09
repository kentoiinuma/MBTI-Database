module Api
  module V1
    class OgpController < ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

      def show
        @post = Post.find(params[:id])
        @media_works = @post.media_works

        # OGP画像の生成
        html = render_to_string(template: 'ogp/show', layout: false)
        kit = IMGKit.new(html, quality: 100)
        image = kit.to_img(:png)

        # Cloudinaryにアップロード
        response = Cloudinary::Uploader.upload(image, public_id: "ogp_image_#{@post.id}")

        # OGP画像のURLを保存
        OgpImage.create(post: @post, image_url: response['secure_url'])

        # 画像データをレスポンスとして返す
        send_data(image, type: 'image/png', disposition: 'inline')
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
