# frozen_string_literal: true

# このクラスはusersテーブルのnameカラムをnull不許可に変更するマイグレーションを定義します。
class ChangeNameToNotNullInUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :name, false
  end
end
