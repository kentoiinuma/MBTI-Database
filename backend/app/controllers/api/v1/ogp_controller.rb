# frozen_string_literal: true

module Api
  module V1
    class OgpController < ActionController::Base
      include ActionView::Layouts
      include ActionView::Rendering

      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

      def show
        @post = Post.find(params[:id])
        @media_works = @post.media_works

        @media_works.each do |work|
          work.image = clean_image_url(work.image)
        end

        html = render_to_string(
          template: 'api/v1/ogp/show',
          layout: false,
          locals: { media_works: @media_works, post: @post }
        )

        kit = IMGKit.new(html, height: 630, width: 1200, quality: 100)
        img = kit.to_img(:png)

        file = Tempfile.new(['ogp', '.png'], '/tmp')
        file.binmode
        file.write(img)
        file.rewind

        response = Cloudinary::Uploader.upload(file.path, public_id: "ogp_image_#{@post.id}")

        ogp_image = OgpImage.find_or_initialize_by(post: @post)
        ogp_image.update!(image_url: response['secure_url'])

        render json: { ogp_image_url: ogp_image.image_url }, status: :ok
      rescue StandardError => e
        render json: { error: 'Failed to generate OGP image', details: e.message }, status: :internal_server_error
      ensure
        file&.close
        file&.unlink
      end

      def page
        @post = Post.find(params[:id])
        @user = @post.user
        @media_works = @post.media_works
        @ogp_image = @post.ogp_image

        render layout: false
      end

      private

      def record_not_found
        render json: { error: 'Record not found' }, status: :not_found
      end

      def clean_image_url(url)
        url.to_s.gsub(/[^\x20-\x7E]/, '')
      end
    end
  end
end
