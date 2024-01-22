# frozen_string_literal: true

# このクラスはperception_groupsテーブルを作成するためのマイグレーションを定義します。
class CreatePerceptionGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :perception_groups do |t|
      t.integer :perception_group

      t.timestamps
    end
  end
end
