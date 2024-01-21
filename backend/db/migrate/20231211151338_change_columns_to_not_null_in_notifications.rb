class ChangeColumnsToNotNullInNotifications < ActiveRecord::Migration[6.0]
  def change
    change_column_null :notifications, :notification_type, false
    change_column_null :notifications, :related_for_id, false
  end
end
