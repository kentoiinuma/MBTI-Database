# frozen_string_literal: true

# このクラスはmbti_typesテーブルの特定のカラムをnull不許可に変更するマイグレーションを定義します。
class ChangeColumnsToNotNullInMbtiTypes < ActiveRecord::Migration[6.0]
  def change
    change_column_null :mbti_types, :mbti_type, false
    change_column_null :mbti_types, :diagnosis_method, false
  end
end
