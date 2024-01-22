# frozen_string_literal: true

# このクラスはmedia_worksテーブルの特定のカラムをnull不許可に変更するマイグレーションを定義します。
class ChangeColumnsToNotNullInMediaWorks < ActiveRecord::Migration[7.0]
  def change
    change_column_null :media_works, :media_type, false
    change_column_null :media_works, :title, false
    change_column_null :media_works, :thumbnail, false
  end
end
