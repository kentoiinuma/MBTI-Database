class Post < ApplicationRecord
  # 関連付け
  belongs_to :user
  has_many :media_works
  has_many :post_likes
  has_many :notifications
end
