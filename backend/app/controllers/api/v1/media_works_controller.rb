# frozen_string_literal: true

# API V1 名前空間のルートモジュール
module Api
  # V1 名前空間のルートモジュール
  module V1
    # メディア作品に関連するアクションを処理するコントローラー
    class MediaWorksController < ApplicationController
      # メディア作品を作成する
      def create
        media_work = MediaWork.new(media_work_params)

        if media_work.save
          render json: { id: media_work.id }
        else
          render json: { error: media_work.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def index
        if params[:post_id]
          media_works = MediaWork.where(post_id: params[:post_id])
          render json: media_works
        else
          render json: { error: 'post_id is required' }, status: :bad_request
        end
      end

      # 統計情報を提供する
      def statistics
        mbti_types = extract_mbti_types
        diagnosis_methods = extract_diagnosis_methods

        user_ids = MbtiType.where(mbti_type: mbti_types, diagnosis_method: diagnosis_methods).pluck(:user_id)
        post_ids = Post.where(user_id: user_ids).pluck(:id)
        titles = MediaWork.where(post_id: post_ids).group(:title).count
        render json: titles
      end

      private

      # メディア作品のストロングパラメータ
      def media_work_params
        params.permit(:post_id, :title, :image, :media_type)
      end

      # MBTIタイプを抽出するプライベートメソッド
      def extract_mbti_types
        params[:mbti_types].split(',').map { |type| MbtiType.mbti_types[type] }
      end

      # 診断方法を抽出するプライベートメソッド
      def extract_diagnosis_methods
        params[:diagnosis_methods].split(',').map { |method| MbtiType.diagnosis_methods[method] }
      end
    end
  end
end
