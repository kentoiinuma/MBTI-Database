# frozen_string_literal: true

module Api
  module V1
    # ユーザー登録に関連する情報を扱うコントローラー
    class RegistrationsController < ApplicationController
      # 新規ユーザー作成
      def create
        clerk_user_id = params[:clerk_user_id]

        if clerk_user_id.present?
          user = find_or_initialize_user(clerk_user_id)
          save_user(user)
        else
          log_and_render_error('clerk_user_id is empty', 'clerk_user_id is empty')
        end
      end

      private

      # Clerkからユーザーデータを取得し、設定
      def find_or_initialize_user(clerk_user_id)
        clerk = Clerk::SDK.new
        clerk_user = clerk.users.find(clerk_user_id)

        user = User.find_or_initialize_by(clerk_id: clerk_user_id)

        user.username = clerk_user['username']

        uploaded_image = Cloudinary::Uploader.upload(clerk_user['profile_image_url'])
        user.avatar_url = uploaded_image['secure_url'] 

        user
      end

      # 新規ユーザーかどうかをレスポンスとして返す
      # 新規ユーザーの場合、保存
      def save_user(user)
        if user.new_record?
          if user.save
            render json: { status: 'ok', is_new_user: true }
          else
            log_and_render_error("Failed to save user: #{user.errors.full_messages.join(', ')}",
                                 user.errors.full_messages)
          end
        else
          render json: { status: 'ok', is_new_user: false }
        end
      end

      # エラーをログに記録し、レスポンスとして返す
      def log_and_render_error(log_message, response_message)
        Rails.logger.error log_message
        render json: { status: 'error', message: response_message }, status: :unprocessable_entity
      end
    end
  end
end
