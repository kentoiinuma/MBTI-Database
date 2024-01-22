# frozen_string_literal: true

# このクラスはmedia_worksテーブルのthumbnailカラムの名前をimageに変更するマイグレーションを定義します。
class RenameThumbnailToImageInMediaWorks < ActiveRecord::Migration[7.0]
  def change
    rename_column :media_works, :thumbnail, :image
  end
end
