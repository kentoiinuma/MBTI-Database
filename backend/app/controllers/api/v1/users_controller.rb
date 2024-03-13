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

      # ユーザー情報を更新するアクション
      def update
        user = User.find_by(clerk_id: params[:id])
        if user.update(user_params)
          
          render_user(user)
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      # ユーザーの情報をJSON形式でレンダリングする
      def render_user(user)
        render json: {
          username: user.username,
          avatar_url: user.avatar_url # ここをprofile_image_urlからavatar_urlに変更
        }
      end

      # ストロングパラメーター
      def user_params
        params.require(:user).permit(:username, :avatar_url)
      end
    end
  end
end
