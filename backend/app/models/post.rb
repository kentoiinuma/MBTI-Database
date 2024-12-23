# frozen_string_literal: true

# 投稿を扱うモデル
class Post < ApplicationRecord
  belongs_to :user
  has_many :media_works, dependent: :destroy
  has_many :post_likes, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_one :ogp_image, dependent: :destroy
end
