class ChangeColumnsToNotNullInMediaWorks < ActiveRecord::Migration[7.0]
  def change
    change_column_null :media_works, :media_type, false
    change_column_null :media_works, :title, false
    change_column_null :media_works, :thumbnail, false
  end
end

