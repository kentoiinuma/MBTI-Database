# frozen_string_literal: true

class CreatePerceptionGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :perception_groups do |t|
      t.integer :perception_group

      t.timestamps
    end
  end
end
