class MediaWork < ApplicationRecord
    # 関連付け
    belongs_to :post
    
    # enumの定義
    enum media_type: { anime: 0, music: 5 }

    # バリデーション
    validates :title, presence: true
    validates :image, presence: true
  end
  
