class RemoveFieldsFromPosts < ActiveRecord::Migration[7.0]
  def change
    remove_column :posts, :composite_image, :string
    remove_column :posts, :media_work_id, :bigint
  end
end

