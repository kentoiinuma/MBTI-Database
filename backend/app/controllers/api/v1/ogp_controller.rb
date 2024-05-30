module Api
  module V1
    class OgpController < ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

      def show
        @post = Post.find(params[:id])
        @user = @post.user
        @media_works = @post.media_works
    
        html = render_to_string(template: 'ogp/show', layout: false)
        kit = IMGKit.new(html, quality: 100)
        send_data(kit.to_img(:png), type: 'image/png', disposition: 'inline', filename: "#{@user.username}_favorite_artists.png")
      end

      def page
        @post = Post.find(params[:id])
        @user = @post.user
        @media_works = @post.media_works
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
