# frozen_string_literal: true

# コメントに対する「いいね」を扱うモデル
class CommentLike < ApplicationRecord
  belongs_to :user
  belongs_to :comment

  # 同一ユーザーが同一コメントに対して複数のいいねをできないようにする
  validates :user_id, uniqueness: { scope: :comment_id }
end
