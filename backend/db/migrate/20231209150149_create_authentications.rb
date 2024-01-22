# frozen_string_literal: true

class CreateAuthentications < ActiveRecord::Migration[7.0]
  def change
    create_table :authentications do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :provider
      t.string :auth_id

      t.timestamps
    end
  end
end
