# frozen_string_literal: true

# 投稿に対するコメントを表すモデル
class Comment < ApplicationRecord
  # 関連付け
  belongs_to :user
  belongs_to :parent_comment, class_name: 'Comment', optional: true
  has_many :child_comments, class_name: 'Comment', foreign_key: 'parent_comment_id', dependent: :destroy
  has_many :comment_likes, dependent: :destroy
  has_many :notifications, dependent: :destroy
  # バリデーション
  validates :text, presence: true
end
