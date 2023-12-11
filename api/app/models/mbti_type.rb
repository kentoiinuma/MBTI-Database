class MbtiType < ApplicationRecord
  belongs_to :user

  # MBTIの16タイプを知覚機能別に分類
  enum mbti_type: {
    esfp: 0, estp: 1, isfp: 2, istp: 3, # Se
    esfj: 4, estj: 5, isfj: 6, istj: 7, # Si
    enfp: 8, entp: 9, infp: 10, intp: 11, # Ne
    enfj: 12, entj: 13, infj: 14, intj: 15  # Ni
  }

  # 診断方法を逆の順番に定義
  enum diagnosis_method: {
    online_test: 0, self_assessment: 1, official: 2
  }

  # バリデーションの追加
  validates :mbti_type, presence: true
  validates :diagnosis_method, presence: true
end
