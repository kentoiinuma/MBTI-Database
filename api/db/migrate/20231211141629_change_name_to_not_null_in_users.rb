class ChangeNameToNotNullInUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :name, false
  end
end
