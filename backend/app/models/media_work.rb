# frozen_string_literal: true

# メディア作品を表すモデル
class MediaWork < ApplicationRecord
  # 関連付け
  belongs_to :post

  # enumの定義
  enum media_type: { anime: 0, music: 5 }

  # バリデーション
  validates :title, presence: true
  validates :image, presence: true
  validates :media_type, inclusion: { in: media_types.keys }
end
