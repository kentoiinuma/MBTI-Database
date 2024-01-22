# frozen_string_literal: true

# このクラスはcomment_likesテーブルを作成するためのマイグレーションを定義します。
class CreateCommentLikes < ActiveRecord::Migration[7.0]
  def change
    create_table :comment_likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :comment, null: false, foreign_key: true

      t.timestamps
    end
  end
end
