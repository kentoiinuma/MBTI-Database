class ChangePerceptionGroupToNotNullInPerceptionGroups < ActiveRecord::Migration[7.0]
  def change
    change_column_null :perception_groups, :perception_group, false
  end
end