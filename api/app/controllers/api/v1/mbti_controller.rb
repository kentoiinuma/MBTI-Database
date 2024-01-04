module Api
  module V1
    class MbtiController < ApplicationController
      def create
        user = User.find_by(clerk_id: params[:user_id])
        mbti = MbtiType.new(mbti_params.merge(user_id: user.id)) 
        if mbti.save
          render json: { status: 'SUCCESS', data: mbti }
        else
          render json: { status: 'ERROR', data: mbti.errors }
        end
      end

      def show
        user = User.find_by(clerk_id: params[:user_id])
        if user
          @mbti_type = MbtiType.find_by(user_id: user.id)
          if @mbti_type
            render json: { mbti_type: @mbti_type.mbti_type }
          else
            render json: { error: 'MbtiType not found' }, status: 404
          end
        else
          render json: { error: 'User not found' }, status: 404
        end
      end

      private

      def mbti_params
        params.require(:mbti).permit(:mbti_type, :diagnosis_method, :user_id)
      end
    end
  end
end


