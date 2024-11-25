# frozen_string_literal: true

# ユーザーを扱うモデル
class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_one :mbti_type, dependent: :destroy
  has_many :post_likes, dependent: :destroy
  has_many :comment_likes, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :clerk_id, presence: true
  validates :username, presence: true
  validates :avatar_url, presence: true
end
