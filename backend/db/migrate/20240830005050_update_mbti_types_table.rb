class UpdateMbtiTypesTable < ActiveRecord::Migration[7.0]
  def change
    remove_column :mbti_types, :diagnosis_method, :integer
    add_column :mbti_types, :visibility, :integer, null: false, default: 0
  end
end
