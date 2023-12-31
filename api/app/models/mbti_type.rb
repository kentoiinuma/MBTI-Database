class MbtiType < ApplicationRecord
  belongs_to :user

  # MBTIの16タイプを知覚機能別に分類
  enum mbti_type: {
    ESFP: 0, ESTP: 1, ISFP: 2, ISTP: 3, # Se
    ESFJ: 4, ESTJ: 5, ISFJ: 6, ISTJ: 7, # Si
    ENFP: 8, ENTP: 9, INFP: 10, INTP: 11, # Ne
    ENFJ: 12, ENTJ: 13, INFJ: 14, INTJ: 15  # Ni
  }

  # 診断方法を逆の順番に定義
  enum diagnosis_method: {
    self_assessment: 0, official_assessment: 5
  }

  # バリデーションの追加
  validates :mbti_type, presence: true
  validates :diagnosis_method, presence: true
end
