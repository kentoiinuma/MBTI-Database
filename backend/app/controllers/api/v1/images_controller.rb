# frozen_string_literal: true

require 'cloudinary'

module Api
  module V1
    # 画像に関連するアクションを処理するコントローラー
    class ImagesController < ApplicationController
      # 画像をアップロードし、中央をクロップするアクション
      def upload
        # 画像URLをリクエストボディから取得
        image_url = params[:imageUrl]

        # Cloudinaryに画像をアップロードし、中央をクロップ
        result = Cloudinary::Uploader.upload(image_url, width: 600, height: 600, crop: 'fill')

        # アップロードが成功したら、そのURLをレスポンスとして返す
        if result['url']
          render json: { url: result['url'] }
        else
          render json: { error: 'Image upload failed' }, status: :unprocessable_entity
        end
      end
    end
  end
end
