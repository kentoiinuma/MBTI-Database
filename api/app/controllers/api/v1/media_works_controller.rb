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
      end
    end
  end