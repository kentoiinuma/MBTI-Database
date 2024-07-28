# frozen_string_literal: true

require_relative 'base_object'

module Types
  class AnimeType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :image, AnimeImageType, null: true
  end

  class AnimeImageType < Types::BaseObject
    field :recommended_image_url, String, null: true
    field :facebook_og_image_url, String, null: true
    field :twitter_image_url, String, null: true
  end
end