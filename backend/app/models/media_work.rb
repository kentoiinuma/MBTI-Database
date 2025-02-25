# frozen_string_literal: true

# メディア作品を扱うモデル
class MediaWork < ApplicationRecord
  belongs_to :post

  enum media_type: { anime: 0, music: 5 }

  validates :title, :image, presence: true
  validates :media_type, inclusion: { in: media_types.keys }
end
