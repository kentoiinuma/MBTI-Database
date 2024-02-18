# frozen_string_literal: true

# MBTIタイプに関連するアクションを処理するコントローラー
module Api
  # V1 名前空間のルートモジュール
  module V1
    # MBTIタイプに関連するアクションを処理するコントローラー
    class MbtiController < ApplicationController
      # 新しいMBTIタイプを作成し、ユーザーに関連付けるアクション
      def create
        user = find_user_by_clerk_id
        mbti = MbtiType.new(mbti_params.merge(user_id: user.id))
        if mbti.save
          render json: { status: 'SUCCESS', data: mbti }
        else
          render json: { status: 'ERROR', data: mbti.errors }
        end
      end

      # 特定のユーザーのMBTIタイプを表示するアクション
      def show
        user = find_user_by_clerk_id
        return render_user_not_found unless user

        @mbti_type = MbtiType.find_by(user_id: user.id)
        if @mbti_type
          render json: { mbti_type: @mbti_type.mbti_type }
        else
          render json: { error: 'MbtiType not found' }, status: 404
        end
      end

      # ユーザーのMBTIタイプを更新するアクション
      def update
        user = find_user_by_clerk_id
        return render_user_not_found unless user

        mbti = MbtiType.find_or_initialize_by(user_id: user.id)
        if mbti.update(mbti_params)
          render json: { status: 'SUCCESS', data: mbti }
        else
          render json: { status: 'ERROR', data: mbti.errors }
        end
      end

      private

      def find_user_by_clerk_id
        User.find_by(clerk_id: params[:user_id])
      end

      def render_user_not_found
        render json: { error: 'User not found' }, status: 404
      end

      def mbti_params
        params.require(:mbti).permit(:mbti_type, :diagnosis_method, :user_id)
      end
    end
  end
end
