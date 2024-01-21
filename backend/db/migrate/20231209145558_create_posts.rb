class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.references :media_work, null: false, foreign_key: true
      t.string :composite_image

      t.timestamps
    end
  end
end
