# frozen_string_literal: true

module Api
  module V1
    class RegistrationsController < ApplicationController
      def create
        # フロントエンドから送信されたユーザーIDを取得
        clerk_user_id = params[:clerk_user_id]
        Rails.logger.info "Received clerk_user_id: #{clerk_user_id}"

        # clerk_user_idが空でないことを確認
        if clerk_user_id.present?
          # Clerkからユーザー情報を取得
          clerk = Clerk::SDK.new
          clerk.users.find(clerk_user_id)

          # usersテーブルに新しいレコードを作成（または既存のレコードを更新）
          user = User.find_or_initialize_by(clerk_id: clerk_user_id)
          is_new_user = user.new_record?
          if user.save
            # レスポンスを送信
            render json: { status: 'ok', is_new_user: }
          else
            Rails.logger.error "Failed to save user: #{user.errors.full_messages.join(', ')}"
            render json: { status: 'error', errors: user.errors.full_messages }
          end
        else
          Rails.logger.error 'clerk_user_id is empty'
          render json: { status: 'error', message: 'clerk_user_id is empty' }
        end
      end
    end
  end
end
