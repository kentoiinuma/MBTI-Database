class Comment < ApplicationRecord
  # 関連付け
  belongs_to :user
  belongs_to :perception_group
  has_many :comment_likes
  has_many :notifications
  # バリデーション
  validates :text, presence: true
end
