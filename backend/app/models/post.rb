# frozen_string_literal: true

# 投稿を表すモデル
class Post < ApplicationRecord
  # 関連付け
  belongs_to :user
  has_many :media_works, dependent: :destroy
  has_many :post_likes, dependent: :destroy
  has_many :notifications, dependent: :destroy
end
