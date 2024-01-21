require 'cloudinary'

module Api
  module V1
    class ImagesController < ApplicationController
      def upload
        # 画像URLをリクエストボディから取得
        image_url = params[:imageUrl]

        # Debug log to inspect the received params
        Rails.logger.debug "Received params: #{params.inspect}"

        # Cloudinaryに画像をアップロードし、中央をクロップ
        result = Cloudinary::Uploader.upload(image_url, width: 600, height: 600, crop: "fill")

        # アップロードが成功したら、そのURLをレスポンスとして返す
        if result["url"]
          render json: { url: result["url"] }
        else
          render json: { error: "Image upload failed" }, status: :unprocessable_entity
        end
      end
    end
  end
end