# frozen_string_literal: true

# Spotifyに関連する情報を扱うコントローラー
class SpotifyController < ApplicationController
  # アーティストを検索して結果を返す
  def search
    artist_name = params[:artist_name]
    spotify_service = SpotifyService.new
    artist = spotify_service.search_artist(artist_name)

    if artist
      render json: { artist: }
    else
      render json: { error: 'Artist not found' }, status: :not_found
    end
  end
end
