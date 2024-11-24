class AddUniqueIndexToMbtiTypesUserId < ActiveRecord::Migration[7.0]
  def change
    # 既存のインデックスを削除
    remove_index :mbti_types, :user_id
    
    # ユニークインデックスを追加
    add_index :mbti_types, :user_id, unique: true
  end
end
