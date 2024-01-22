# frozen_string_literal: true

# このクラスはpost_likesテーブルを作成するためのマイグレーションを定義します。
class CreatePostLikes < ActiveRecord::Migration[7.0]
  def change
    create_table :post_likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true

      t.timestamps
    end
  end
end
