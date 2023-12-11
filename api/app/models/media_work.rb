class MediaWork < ApplicationRecord
    # enumの定義
    enum media_type: { anime: 0, music: 1 }
    
    # 関連付け
    has_many :posts
    
    # バリデーション
    validates :title, presence: true
    validates :thumbnail, presence: true, format: { with: /\Ahttp[s]?:\/\/.+\z/, message: 'must be a valid URL' }
    
    # media_typeに応じたジャンルのセットを返すメソッド
    # ジャンルは本リリース時で良い(Annict APIにはジャンルが設定されてないかも)
    def self.genres_for_media_type(media_type)
      anime_genres = { action: 0, comedy: 1, drama: 2, fantasy: 3 }
      music_genres = { rock: 0, pop: 1, jazz: 2, classical: 3 }
      media_type == 'anime' ? anime_genres : music_genres
    end
  
    # インスタンスのmedia_typeに応じて有効なジャンルを返すメソッド
    def available_genres
      self.class.genres_for_media_type(self.media_type)
    end
  end
  
