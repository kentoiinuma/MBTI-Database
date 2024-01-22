# frozen_string_literal: true

class ChangeClerkIdInUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :clerk_id, false
  end
end
