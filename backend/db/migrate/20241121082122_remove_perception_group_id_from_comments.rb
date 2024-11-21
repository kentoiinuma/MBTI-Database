class RemovePerceptionGroupIdFromComments < ActiveRecord::Migration[7.0]
  def change
    remove_reference :comments, :perception_group, null: false, foreign_key: true
  end
end
