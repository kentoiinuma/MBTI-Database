# frozen_string_literal: true

class UpdatePostIdInMediaWorks < ActiveRecord::Migration[7.0]
  def change
    change_column_null :media_works, :post_id, false
    add_index :media_works, :post_id, name: 'index_media_works_on_post_id'
  end
end
