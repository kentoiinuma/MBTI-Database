# frozen_string_literal: true

class ChangeRelatedForIdAndParentCommentIdToBigint < ActiveRecord::Migration[7.0]
  def change
    change_column :notifications, :related_for_id, :bigint, null: false
    change_column :comments, :parent_comment_id, :bigint
  end
end
