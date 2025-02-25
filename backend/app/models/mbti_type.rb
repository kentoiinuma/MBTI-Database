# frozen_string_literal: true

# MBTIタイプを扱うモデル
class MbtiType < ApplicationRecord
  belongs_to :user

  enum mbti_type: {
    ESFP: 0, ESTP: 1, ISFP: 2, ISTP: 3, # Se
    ESFJ: 4, ESTJ: 5, ISFJ: 6, ISTJ: 7, # Si
    ENFP: 8, ENTP: 9, INFP: 10, INTP: 11, # Ne
    ENFJ: 12, ENTJ: 13, INFJ: 14, INTJ: 15 # Ni
  }

  enum visibility: {
    is_private: 0,
    is_public: 1
  }

  validates :user_id, uniqueness: true
  validates :mbti_type, presence: true, inclusion: { in: mbti_types.keys }
  validates :visibility, presence: true, inclusion: { in: visibilities.keys }
end
