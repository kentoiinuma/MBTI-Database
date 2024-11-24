class AddParentCommentForeignKeyToComments < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :comments, :comments, column: :parent_comment_id
    add_index :comments, :parent_comment_id
  end
end
