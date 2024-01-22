# frozen_string_literal: true

class CreateMbtiTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :mbti_types do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :mbti_type
      t.integer :diagnosis_method

      t.timestamps
    end
  end
end
