# frozen_string_literal: true

require_relative 'base_object'
require_relative 'node_type'
require_relative 'anime_type'

module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [Types::NodeType, null: true], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ID], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    field :search_works, [AnimeType], null: false do
      argument :titles, [String], required: true
      argument :first, Integer, required: false
    end

    def search_works(titles:, first: 10)
      access_token = ENV['ANNICT_ACCESS_TOKEN']
      url = "https://api.annict.com/graphql"
      query = <<~GRAPHQL
        query ($titles: [String!]!, $first: Int!) {
          searchWorks(titles: $titles, first: $first) {
            nodes {
              id
              title
              image {
                recommendedImageUrl
                facebookOgImageUrl
                twitterImageUrl
              }
            }
          }
        }
      GRAPHQL

      variables = { titles: titles, first: first }

      response = HTTP.post(url, json: { query: query, variables: variables }, headers: { 'Authorization' => "Bearer #{access_token}" })
      data = JSON.parse(response.body.to_s)

      if data['data'] && data['data']['searchWorks'] && data['data']['searchWorks']['nodes']
        data['data']['searchWorks']['nodes'].map do |anime|
          {
            id: anime['id'],
            title: anime['title'],
            image: {
              recommended_image_url: anime['image']['recommendedImageUrl'],
              facebook_og_image_url: anime['image']['facebookOgImageUrl'],
              twitter_image_url: anime['image']['twitterImageUrl']
            }
          }
        end
      else
        []
      end
    end

    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World!"
    end
  end
end