# frozen_string_literal: true

class ChangeColumnsToNotNullInMbtiTypes < ActiveRecord::Migration[6.0]
  def change
    change_column_null :mbti_types, :mbti_type, false
    change_column_null :mbti_types, :diagnosis_method, false
  end
end
