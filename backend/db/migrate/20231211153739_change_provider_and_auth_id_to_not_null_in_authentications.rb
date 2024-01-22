# frozen_string_literal: true

# このクラスはauthenticationsテーブルのproviderとauth_idカラムをnull不許可に変更するマイグレーションを定義します。
class ChangeProviderAndAuthIdToNotNullInAuthentications < ActiveRecord::Migration[7.0]
  def change
    change_column_null :authentications, :provider, false
    change_column_null :authentications, :auth_id, false
  end
end
