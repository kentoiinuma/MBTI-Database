class Post < ApplicationRecord
  belongs_to :user
  belongs_to :media_work
end
