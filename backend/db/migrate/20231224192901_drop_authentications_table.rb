class DropAuthenticationsTable < ActiveRecord::Migration[7.0]
  def up
    drop_table :authentications
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
