# frozen_string_literal: true

# MBTIタイプに関連する情報を扱うコントローラー
class MbtiController < ApplicationController
  before_action :set_user

  # 新しいMBTIタイプを作成し、ユーザーに関連付ける
  def create
    mbti = @user.create_mbti_type(mbti_params)
    if mbti.persisted?
      render json: { data: mbti }, status: :created
    else
      render json: { errors: mbti.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 特定のユーザーのMBTIタイプを取得する
  def show
    mbti_type = @user.mbti_type
    if mbti_type
      render json: { mbti_type: mbti_type.mbti_type, visibility: mbti_type.visibility }
    else
      render json: { mbti_type: nil, errors: ['MBTI type not set'] }, status: :ok
    end
  end

  # ユーザーのMBTIタイプを更新する
  def update
    mbti = MbtiType.find_or_initialize_by(user_id: @user.id)
    if mbti.update(mbti_params)
      render json: { data: mbti }
    else
      render json: { errors: mbti.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find_by(clerk_id: params[:clerk_id])
    return if @user

    render json: { error: 'User not found' }, status: :not_found
    nil
  end

  def mbti_params
    params.permit(:mbti_type, :visibility)
  end
end
