# frozen_string_literal: true

# API V1 名前空間のルートモジュール
module Api
  # V1 名前空間のルートモジュール
  module V1
    # メディア作品に関連するアクションを処理するコントローラー
    class MediaWorksController < ApplicationController
      # 新しいメディア作品をデータベースに保存します。
      # 成功した場合、作成されたメディア作品のIDを含むJSONを返します。
      # 失敗した場合、エラーメッセージを含むJSONを返します。
      def create
        media_work = MediaWork.new(media_work_params)

        if media_work.save
          render json: { id: media_work.id }
        else
          render json: { error: media_work.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # 特定のpost_idに関連するメディア作品を取得します。
      # post_idが指定されていない場合は、エラーメッセージを返します。
      def index
        if params[:post_id]
          media_works = MediaWork.where(post_id: params[:post_id])
          render json: media_works
        else
          render json: { error: 'post_id is required' }, status: :bad_request
        end
      end

      # MBTIタイプと診断方法に基づいて、メディア作品のタイトルとその出現回数の統計情報を提供します。
      def statistics
        mbti_types = extract_mbti_types
        media_type = extract_media_type

        user_ids = MbtiType.where(mbti_type: mbti_types).pluck(:user_id)
        post_ids = Post.where(user_id: user_ids).pluck(:id)
        titles = MediaWork.where(post_id: post_ids, media_type: media_type).group(:title).count
        render json: titles
      end

      private

      # メディア作品を作成するために必要なパラメータを検証し、許可します。
      def media_work_params
        params.permit(:post_id, :title, :image, :media_type)
      end

      # リクエストからMBTIタイプを抽出し、対応する内部表現に変換します。
      def extract_mbti_types
        params[:mbti_types].split(',').map { |type| MbtiType.mbti_types[type] }
      end

      # この関数は削除します
      # def extract_diagnosis_methods
      #   params[:diagnosis_methods].split(',').map { |method| MbtiType.diagnosis_methods[method] }
      # end

      def extract_media_type
        MediaWork.media_types[params[:media_type]]
      end
    end
  end
end