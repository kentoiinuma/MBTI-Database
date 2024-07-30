require 'net/http'
require 'json'

class Api::V1::AnilistController < ApplicationController
  def search
    query = <<~GRAPHQL
      query ($search: String) {
        Page(perPage: 10) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              native
            }
            coverImage {
              large
            }
          }
        }
      }
    GRAPHQL

    variables = { search: params[:anime_title] }

    uri = URI('https://graphql.anilist.co')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)
    request['Content-Type'] = 'application/json'
    request.body = { query: query, variables: variables }.to_json

    response = http.request(request)

    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      render json: data['data']['Page']['media']
    else
      render json: { error: 'Failed to fetch anime data' }, status: :unprocessable_entity
    end
  end
end