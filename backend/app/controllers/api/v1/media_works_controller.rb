module Api
  module V1
    class MediaWorksController < ApplicationController
      def create
        media_work = MediaWork.new(
          post_id: params[:post_id],
          title: params[:title],
          image: params[:image],
          media_type: params[:media_type]
        )

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

      def statistics
        mbti_types = params[:mbti_types].split(',').map { |type| MbtiType.mbti_types[type] }
        diagnosis_methods = params[:diagnosis_methods].split(',').map { |method| MbtiType.diagnosis_methods[method] }

        user_ids = MbtiType.where(mbti_type: mbti_types, diagnosis_method: diagnosis_methods).pluck(:user_id)
        post_ids = Post.where(user_id: user_ids).pluck(:id)
        titles = MediaWork.where(post_id: post_ids).group(:title).count
        render json: titles
      end
    end
  end
end
