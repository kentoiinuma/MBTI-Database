# frozen_string_literal: true

# このクラスはmedia_worksテーブルを作成するためのマイグレーションを定義します。
class CreateMediaWorks < ActiveRecord::Migration[7.0]
  def change
    create_table :media_works do |t|
      t.integer :media_type
      t.string :title
      t.integer :genres
      t.string :thumbnail

      t.timestamps
    end
  end
end
