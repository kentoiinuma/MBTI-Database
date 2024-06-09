class CreateOgpImages < ActiveRecord::Migration[7.0]
  def change
    create_table :ogp_images do |t|
      t.references :post, null: false, foreign_key: true
      t.string :image_url, null: false

      t.timestamps
    end
  end
end
