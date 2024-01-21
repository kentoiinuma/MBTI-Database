class AddPostIdToMediaWorks < ActiveRecord::Migration[7.0]
  def change
    add_column :media_works, :post_id, :bigint
    add_foreign_key :media_works, :posts
  end
end
