# frozen_string_literal: true

# OGP画像を扱うモデル
class OgpImage < ApplicationRecord
  belongs_to :post

  validates :image_url, presence: true
end
