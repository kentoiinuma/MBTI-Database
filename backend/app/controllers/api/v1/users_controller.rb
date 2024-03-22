# frozen_string_literal: true

# API V1 名前空間のルートモジュール
module Api
  # V1 名前空間のルートモジュール
  module V1
    # clerkユーザーに関連するアクションを処理するコントローラー
    class UsersController < ApplicationController
      # 特定のユーザーの情報を表示するアクション
      def show
        user = User.find_by(clerk_id: params[:id])
        if user
          render_user(user)
        else
          render json: { error: 'User not found' }, status: :not_found
        end
      end

      # ユーザーネームを更新するアクション
      def update_name
        user = User.find_by(clerk_id: params[:id])
        if user.update(user_params)
          render_user(user)
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ユーザーのアバター画像をアップロードするアクション
      def upload_avatar
        user = User.find_by(clerk_id: params[:id])
        if user
          # Cloudinaryに画像をアップロードし、URLを取得
          uploaded_image = Cloudinary::Uploader.upload(params[:avatar].tempfile.path) # 修正箇所
          if uploaded_image['url']
            # アップロードされた画像のURLでユーザーのavatar_urlを更新
            user.update(avatar_url: uploaded_image['url'])
            render_user(user)
          else
            render json: { error: 'Failed to upload image' }, status: :unprocessable_entity
          end
        else
          render json: { error: 'User not found' }, status: :not_found
        end
      end

      private

      # ユーザーの情報をJSON形式でレンダリングする
      def render_user(user)
        render json: {
          username: user.username,
          avatar_url: user.avatar_url,
          clerk_id: user.clerk_id # 追加: clerk_idをJSONレスポンスに含める
        }
      end

      # ストロングパラメーター
      def user_params
        params.require(:user).permit(:username, :avatar_url)
      end
    end
  end
end
