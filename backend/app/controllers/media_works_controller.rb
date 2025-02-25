# frozen_string_literal: true

# メディア作品に関連する情報を扱うコントローラー
class MediaWorksController < ApplicationController
  before_action :set_post, only: :index

  # メディア作品を作成する
  def create
    upload_result = upload_image(params[:image])

    media_work = MediaWork.create(media_work_params.merge(image: upload_result['url']))

    if media_work.persisted?
      render json: { id: media_work.id }, status: :created
    else
      render json: { errors: media_work.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # 特定の投稿のメディア作品を取得する
  def index
    render json: @post.media_works
  end

  # MBTIタイプとメディアタイプに基づいた統計情報を取得する
  def statistics
    titles = MediaWork.joins(post: { user: :mbti_type })
                      .where(mbti_types: { mbti_type: extract_mbti_types })
                      .where(media_type: extract_media_type)
                      .group(:title)
                      .count

    render json: titles
  end

  private

  def set_post
    @post = Post.find_by(id: params[:post_id])
    render json: { error: 'Post not found' }, status: :not_found unless @post
  end

  def media_work_params
    params.permit(:post_id, :title, :image, :media_type)
  end

  def upload_image(image_url)
    Cloudinary::Uploader.upload(image_url, width: 600, height: 600, crop: 'fill')
  end

  def extract_mbti_types
    params[:mbti_types].to_s.split(',').map { |type| MbtiType.mbti_types[type] }
  end

  def extract_media_type
    MediaWork.media_types[params[:media_type]]
  end
end
