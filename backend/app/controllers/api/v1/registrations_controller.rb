# frozen_string_literal: true

module Api
  module V1
    # ユーザー登録に関連するアクションを処理するコントローラー
    class RegistrationsController < ApplicationController
      # ユーザーを作成または更新する
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

      # ユーザーを検索または初期化する
      def find_or_initialize_user(clerk_user_id)
        clerk = Clerk::SDK.new
        clerk_user = clerk.users.find(clerk_user_id)

        user = User.find_or_initialize_by(clerk_id: clerk_user_id)
        user.username = clerk_user['username'] # 修正: ハッシュから値を取得

        # Clerkから取得したアイコンURLを使用してCloudinaryにアップロードし、URLを取得
        uploaded_image = Cloudinary::Uploader.upload(clerk_user['profile_image_url']) # 修正: ハッシュから値を取得
        user.avatar_url = uploaded_image['secure_url'] # CloudinaryからのセキュアURLを保存

        user
      end

      # ユーザーを保存する
      def save_user(user)
        is_new_user = user.new_record?
        if is_new_user
          if user.save
            render json: { status: 'ok', is_new_user: true }
          else
            log_and_render_error("Failed to save user: #{user.errors.full_messages.join(', ')}",
                                 user.errors.full_messages)
          end
        else
          # 新規レコードでない場合は、保存せずに既存ユーザーであることを示すレスポンスを返す
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
