# frozen_string_literal: true

# 通知を管理するモデル
class Notification < ApplicationRecord
  # 関連付け
  belongs_to :user
  belongs_to :post
  belongs_to :comment
  # これは通知を受け取ったユーザーへの関連付けです。
  belongs_to :related_user, class_name: 'User', foreign_key: 'related_for_id'

  # enumの定義
  enum notification_type: { like: 0, comment: 1 }

  # 追加するバリデーション
  validates :notification_type, inclusion: { in: notification_types.keys }
end
