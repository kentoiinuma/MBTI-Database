module Api
    module V1
      class PostsController < ApplicationController
        def create
          puts params[:clerk_id] 
          user = User.find_by(clerk_id: params[:clerk_id])
          if user
            post = Post.new(user_id: user.id)

            if post.save
              render json: { id: post.id }
            else
              render json: { error: post.errors.full_messages }, status: :unprocessable_entity
            end
          else
            render json: { error: "User not found" }, status: :not_found
          end
        end
      end
    end
end