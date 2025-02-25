# frozen_string_literal: true

# 投稿に関連する情報を扱うコントローラー
class PostsController < ApplicationController
  before_action :set_user, only: %i[create user_posts]
  before_action :set_post, only: %i[show destroy]

  # 投稿を作成する
  def create
    if existing_post?(params[:media_type])
      return render json: { error: 'You can only post once for this media type' }, status: :unprocessable_entity
    end

    post = @user.posts.create
    if post.persisted?
      render json: { id: post.id }, status: :created
    else
      render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 全ての投稿を取得する
  def index
    posts = Post.includes(:user).order(created_at: :desc)
    render json: posts.as_json(include: [:user])
  end

  # 特定のユーザーの投稿を取得する
  def user_posts
    render json: @user.posts
  end

  # 特定の投稿を取得する
  def show
    render json: @post.as_json(include: %i[user media_works])
  end

  # 投稿を削除する
  def destroy
    if @post.destroy
      render json: { message: 'Post deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete the post' }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find_by(clerk_id: params[:clerk_id])
    return if @user

    render json: { error: 'User not found' }, status: :not_found
  end

  def set_post
    @post = Post.find_by(id: params[:id])
    return if @post

    render json: { error: 'Post not found' }, status: :not_found
  end

  # ユーザーが指定されたmedia_typeの投稿を既に持っているか確認する
  def existing_post?(media_type)
    @user.posts.joins(:media_works).where(media_works: { media_type: media_type.to_i }).exists?
  end
end
