# frozen_string_literal: true

# MBTIタイプを管理するモデル
class MbtiType < ApplicationRecord
  belongs_to :user

  # MBTIの16タイプを知覚機能別に分類
  enum mbti_type: {
    ESFP: 0, ESTP: 1, ISFP: 2, ISTP: 3, # Se
    ESFJ: 4, ESTJ: 5, ISFJ: 6, ISTJ: 7, # Si
    ENFP: 8, ENTP: 9, INFP: 10, INTP: 11, # Ne
    ENFJ: 12, ENTJ: 13, INFJ: 14, INTJ: 15 # Ni
  }

  # visibilityの定義を変更
  enum visibility: {
    is_private: 0,
    is_public: 1
  }, _prefix: true

  # バリデーションの追加
  validates :mbti_type, presence: true
  validates :visibility, presence: true
end
