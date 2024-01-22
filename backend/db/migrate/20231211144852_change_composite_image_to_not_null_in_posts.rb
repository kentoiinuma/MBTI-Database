# frozen_string_literal: true

class ChangeCompositeImageToNotNullInPosts < ActiveRecord::Migration[7.0]
  def change
    change_column_null :posts, :composite_image, false
  end
end
