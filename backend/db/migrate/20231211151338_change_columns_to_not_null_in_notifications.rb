# frozen_string_literal: true

# このクラスはnotificationsテーブルの特定のカラムをnull不許可に変更するマイグレーションを定義します。
class ChangeColumnsToNotNullInNotifications < ActiveRecord::Migration[6.0]
  def change
    change_column_null :notifications, :notification_type, false
    change_column_null :notifications, :related_for_id, false
  end
end
