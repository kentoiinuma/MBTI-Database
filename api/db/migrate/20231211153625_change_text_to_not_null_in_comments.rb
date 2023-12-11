class ChangeTextToNotNullInComments < ActiveRecord::Migration[6.0]
  def change
    change_column_null :comments, :text, false
  end
end