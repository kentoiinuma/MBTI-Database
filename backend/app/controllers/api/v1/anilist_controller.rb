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
              english
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
      if data['data'] && data['data']['Page'] && data['data']['Page']['media']
        render json: data['data']['Page']['media']
      else
        render json: { error: 'No anime data found' }, status: :not_found
      end
    else
      error_data = JSON.parse(response.body)
      render json: { error: 'Failed to fetch anime data', details: error_data['errors'][0]['message'] }, status: :service_unavailable
    end
  rescue StandardError => e
    render json: { error: 'An error occurred', details: e.message }, status: :internal_server_error
  end
end