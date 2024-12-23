# frozen_string_literal: true

# ユーザーに関連する情報を扱うコントローラー
class UsersController < ApplicationController
  before_action :set_user, only: %i[show update upload_avatar]

  # 特定のユーザーの情報を取得する
  def show
    render_user(@user)
  end

  # ユーザーネームを更新する
  def update
    if @user.update(user_params)
      render_user(@user)
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # ユーザーのアバターを更新する
  def upload_avatar
    uploaded_image = Cloudinary::Uploader.upload(params[:avatar].tempfile.path)
    if uploaded_image['url']
      @user.update(avatar_url: uploaded_image['url'])
      render_user(@user)
    else
      render json: { error: 'Failed to upload image' }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find_by(clerk_id: params[:clerk_id])
    return if @user

    render json: { error: 'User not found' }, status: :not_found
    nil
  end

  def render_user(user)
    render json: {
      username: user.username,
      avatar_url: user.avatar_url,
      clerk_id: user.clerk_id
    }
  end

  def user_params
    params.require(:user).permit(:username, :avatar_url)
  end
end
