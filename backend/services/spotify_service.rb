# frozen_string_literal: true

# app/services/spotify_service.rb

require 'base64'
require 'net/http'

# Spotify APIへの接続を提供するサービス
class SpotifyService
  SPOTIFY_ACCOUNTS_ENDPOINT = 'https://accounts.spotify.com/api/token'
  SPOTIFY_API_ENDPOINT = 'https://api.spotify.com/v1'

  # 初期化メソッド。環境変数からSpotifyのクライアントIDとクライアントシークレットを読み込む
  def initialize
    @client_id = ENV['SPOTIFY_CLIENT_ID']
    @client_secret = ENV['SPOTIFY_CLIENT_SECRET']
  end

  # Spotify APIで認証を行い、アクセストークンを取得する
  def authenticate
    credentials = Base64.strict_encode64("#{@client_id}:#{@client_secret}")
    body = {
      grant_type: 'client_credentials'
    }
    headers = {
      'Authorization' => "Basic #{credentials}",
      'Content-Type' => 'application/x-www-form-urlencoded'
    }

    response = post_request(SPOTIFY_ACCOUNTS_ENDPOINT, body, headers)
    JSON.parse(response.body)['access_token']
  end

  # 指定されたアーティスト名でSpotifyを検索し、最初に見つかったアーティストの情報を返す
  def search_artist(artist_name)
    access_token = authenticate
    headers = {
      'Authorization' => "Bearer #{access_token}",
      'Accept-Language' => 'ja' # Added Accept-Language header
    }
    params = {
      q: artist_name,
      type: 'artist',
      limit: 1
    }

    response = get_request("#{SPOTIFY_API_ENDPOINT}/search", params, headers)
    response_body = JSON.parse(response.body)
    puts "Response Body: #{response_body}" # Log the response body

    response_body['artists']['items'].first
  end

  private

  # 指定されたURLにPOSTリクエストを送信する
  def post_request(url, body, headers)
    uri = URI(url)
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      request = Net::HTTP::Post.new(uri, headers)
      request.set_form_data(body)
      http.request(request)
    end
  end

  # 指定されたURLにGETリクエストを送信する
  def get_request(url, params, headers)
    uri = URI(url)
    uri.query = URI.encode_www_form(params)
    Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      request = Net::HTTP::Get.new(uri, headers)
      http.request(request)
    end
  end
end
