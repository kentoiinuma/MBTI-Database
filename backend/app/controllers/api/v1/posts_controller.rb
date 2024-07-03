# frozen_string_literal: true

# API V1 名前空間のルートモジュール
module Api
  # V1 名前空間のルートモジュール
  module V1
    # 投稿に関連するアクションを処理するコントローラー
    class PostsController < ApplicationController
      # 投稿を作成する
      def create
        user = find_user_by_clerk_id(params[:clerk_id])
        return unless user

        post = user.posts.build
        save_post(post)
      end

      # 投稿を全て取得する
      def all
        posts = Post.all.order(created_at: :desc).includes(:user)
        render json: posts.as_json(include: { user: { only: [:clerk_id] } })
      end

      # ユーザーIDに基づいて投稿を取得する
      def index
        user = find_user_by_clerk_id(params[:user_id])
        return unless user

        render_user_posts(user)
      end

      # 投稿を取得する
      def show
        post = Post.find(params[:id])
        render json: post.as_json(include: { user: { only: %i[clerk_id avatar_url username] },
                                             media_works: { only: %i[title image] } })
      end

      # 投稿を削除する
      def destroy
        post = Post.find(params[:id])
        if post.destroy
          render json: { message: 'Post deleted successfully' }, status: :ok
        else
          render json: { error: 'Failed to delete the post' }, status: :unprocessable_entity
        end
      end

      private

      # clerk_idによってユーザーを検索する
      def find_user_by_clerk_id(clerk_id)
        user = User.find_by(clerk_id:)
        unless user
          render json: { error: 'User not found' }, status: :not_found
          return nil
        end
        user
      end

      # 投稿を保存する
      def save_post(post)
        if post.save
          render json: { id: post.id }
        else
          render json: { error: post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # ユーザーの投稿をレンダリングする
      def render_user_posts(user)
        posts = user.posts
        render json: posts
      end
    end
  end
end
