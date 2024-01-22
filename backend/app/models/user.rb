# frozen_string_literal: true

# ユーザーを表すモデル
class User < ApplicationRecord
  # 関連付け
  has_many :posts
  has_many :mbti_types
  has_many :post_likes
  has_many :comment_likes
  has_many :notifications
  has_many :comments

  # バリデーション
  validates :clerk_id, presence: true
end
