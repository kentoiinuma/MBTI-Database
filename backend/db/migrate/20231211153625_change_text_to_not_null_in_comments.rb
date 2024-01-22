# frozen_string_literal: true

# このクラスはcommentsテーブルのtextカラムをnull不許可に変更するマイグレーションを定義します。
class ChangeTextToNotNullInComments < ActiveRecord::Migration[6.0]
  def change
    change_column_null :comments, :text, false
  end
end
