# frozen_string_literal: true

# このクラスはusersテーブルを作成するためのマイグレーションを定義します。
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :avatar

      t.timestamps
    end
  end
end
