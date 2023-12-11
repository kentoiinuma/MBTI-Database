class User < ApplicationRecord
    # 関連付け
    has_many :posts
    has_many :authentications
    has_many :mbti_types
    has_many :post_likes
    has_many :comment_likes
    has_many :notifications
    has_many :comments
    # バリデーション
    validates :name, presence: true
  
    # Cloudinaryの画像URLを保存するカラムが必要です
    # 例: string型のavatar_urlカラムを追加し、フォームからのアップロードによって
    # Cloudinaryへアップロードした後、得られたURLをここに保存します。
  end
  