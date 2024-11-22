class DropPerceptionGroups < ActiveRecord::Migration[7.0]
  def change
    drop_table :perception_groups
  end
end
