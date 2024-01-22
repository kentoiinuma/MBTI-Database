# frozen_string_literal: true

class ChangeProviderAndAuthIdToNotNullInAuthentications < ActiveRecord::Migration[7.0]
  def change
    change_column_null :authentications, :provider, false
    change_column_null :authentications, :auth_id, false
  end
end
