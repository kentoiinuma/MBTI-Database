class PerceptionGroup < ApplicationRecord
    # 関連付け
    has_many :comments
    # enumの定義（具体的な認識グループを想定しています）
    enum perception_group: { Se: 0, Si: 1, Ne: 2, Ni: 3 }
  end

