# frozen_string_literal: true

# 投稿に対するコメントを表すモデル
class Comment < ApplicationRecord
  # 関連付け
  belongs_to :user
  has_many :comment_likes
  has_many :notifications
  # バリデーション
  validates :text, presence: true
end
