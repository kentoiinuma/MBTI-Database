# frozen_string_literal: true

# API V1 名前空間のルートモジュール
module Api
  # V1 名前空間のルートモジュール
  module V1
    # 投稿に関連するアクションを処理するコントローラー
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
          render json: { error: 'User not found' }, status: :not_found
        end
      end

      def all
        posts = Post.all.order(created_at: :desc).includes(:user)
        render json: posts.as_json(include: { user: { only: [:clerk_id] } })
      end

      def index
        if params[:user_id]
          user = User.find_by(clerk_id: params[:user_id])
          if user
            posts = user.posts
            render json: posts
          else
            render json: { error: 'User not found' }, status: :not_found
          end
        else
          render json: { error: 'User ID is required' }, status: :bad_request
        end
      end
    end
  end
end
