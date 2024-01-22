# frozen_string_literal: true

# このクラスはmbti_typesテーブルを作成するためのマイグレーションを定義します。
class CreateMbtiTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :mbti_types do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :mbti_type
      t.integer :diagnosis_method

      t.timestamps
    end
  end
end
