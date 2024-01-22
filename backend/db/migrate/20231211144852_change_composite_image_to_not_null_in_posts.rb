# frozen_string_literal: true

# このクラスはpostsテーブルのcomposite_imageカラムをnull不許可に変更するマイグレーションを定義します。
class ChangeCompositeImageToNotNullInPosts < ActiveRecord::Migration[7.0]
  def change
    change_column_null :posts, :composite_image, false
  end
end
