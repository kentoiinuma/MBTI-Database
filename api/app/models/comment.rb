class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :perception_group
end
