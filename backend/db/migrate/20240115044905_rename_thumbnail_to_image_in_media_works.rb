# frozen_string_literal: true

class RenameThumbnailToImageInMediaWorks < ActiveRecord::Migration[7.0]
  def change
    rename_column :media_works, :thumbnail, :image
  end
end
