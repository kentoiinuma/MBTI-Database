class Authentication < ApplicationRecord
  belongs_to :user
  # providerが必ず存在し、一意であることを保証
  validates :provider, presence: true, uniqueness: true
  validates :auth_id, presence: true
  # enumの定義（具体的な認証プロバイダーを想定しています）
  enum provider: { google: 0 }
end

