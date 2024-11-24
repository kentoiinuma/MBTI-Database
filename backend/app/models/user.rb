# frozen_string_literal: true

# ユーザーを表すモデル
class User < ApplicationRecord
  # 関連付け
  has_many :posts, dependent: :destroy
  has_one :mbti_type, dependent: :destroy
  has_many :post_likes, dependent: :destroy
  has_many :comment_likes, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :comments, dependent: :destroy

  # バリデーション
  validates :clerk_id, presence: true
  validates :username, presence: true
  validates :avatar_url, presence: true
end
