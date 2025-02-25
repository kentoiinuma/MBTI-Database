# frozen_string_literal: true

# 通知を扱うモデル
class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :post
  belongs_to :comment
  # 通知を受け取ったユーザーへの関連付け
  belongs_to :related_user, class_name: 'User', foreign_key: 'related_for_id'

  enum notification_type: { like: 0, comment: 1 }

  validates :notification_type, presence: true, inclusion: { in: notification_types.keys }
end
