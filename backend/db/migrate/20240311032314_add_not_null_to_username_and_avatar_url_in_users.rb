# frozen_string_literal: true

class AddNotNullToUsernameAndAvatarUrlInUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :username, false
    change_column_null :users, :avatar_url, false
  end
end
