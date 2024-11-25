# frozen_string_literal: true

require 'net/http'
require 'json'

# Anilist APIへの接続を提供するサービス
class AnilistService
  GRAPHQL_ENDPOINT = 'https://graphql.anilist.co'.freeze

  # 指定されたアニメタイトルでAnilistを検索し、結果を返す
  def search(anime_title)
    query = <<~GRAPHQL
      query ($search: String) {
        Page(perPage: 10) {
          media(search: $search, type: ANIME) {
            id
            title {
              native
            }
            coverImage {
              large
            }
          }
        }
      }
    GRAPHQL

    variables = { search: anime_title }

    uri = URI(GRAPHQL_ENDPOINT)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri)
    request['Content-Type'] = 'application/json'
    request.body = { query: query, variables: variables }.to_json

    response = http.request(request)

    if response.is_a?(Net::HTTPSuccess)
      data = JSON.parse(response.body)
      data['data']['Page']['media']
    else
      nil
    end
  end
end
