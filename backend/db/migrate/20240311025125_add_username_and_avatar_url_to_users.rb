class AddUsernameAndAvatarUrlToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :username, :string
    add_column :users, :avatar_url, :string
  end
end
