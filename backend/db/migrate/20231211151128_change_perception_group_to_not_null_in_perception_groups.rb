# frozen_string_literal: true

# このクラスはperception_groupsテーブルのperception_groupカラムをnull不許可に変更するマイグレーションを定義します。
class ChangePerceptionGroupToNotNullInPerceptionGroups < ActiveRecord::Migration[7.0]
  def change
    change_column_null :perception_groups, :perception_group, false
  end
end
