class Post < ApplicationRecord
  # 関連付け
  belongs_to :user
  belongs_to :media_work
  has_many :post_likes
  has_many :notifications
  # バリデーション
  validates :composite_image_url, presence: true
end
