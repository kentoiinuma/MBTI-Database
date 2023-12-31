module Api
  module V1
    class MbtiController < ApplicationController
      def create
        user = User.find_by(clerk_id: params[:user_id])
        mbti = MbtiType.new(mbti_params.merge(user_id: user.id)) # user を user_id: user.id に変更
        if mbti.save
          render json: { status: 'SUCCESS', data: mbti }
        else
          render json: { status: 'ERROR', data: mbti.errors }
        end
      end

      private

      def mbti_params
        params.require(:mbti).permit(:mbti_type, :diagnosis_method, :user_id)
      end
    end
  end
end


