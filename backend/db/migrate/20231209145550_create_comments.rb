# frozen_string_literal: true

class CreateComments < ActiveRecord::Migration[7.0]
  def change
    create_table :comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :perception_group, null: false, foreign_key: true
      t.integer :parent_comment_id
      t.text :text

      t.timestamps
    end
  end
end
