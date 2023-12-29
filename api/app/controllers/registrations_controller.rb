class RegistrationsController < ApplicationController
    def create
      # フロントエンドから送信されたユーザーIDを取得
      clerk_user_id = params[:clerk_user_id]
  
      # Clerkからユーザー情報を取得
      clerk = Clerk::SDK.new
      clerk_user = clerk.users.find(clerk_user_id).first
  
      # usersテーブルに新しいレコードを作成（または既存のレコードを更新）
      user = User.find_or_initialize_by(clerk_id: clerk_user["id"])
      user.update!(clerk_id: clerk_user["id"])
  
      # レスポンスを送信
      render json: { status: 'ok' }
    end
  end
