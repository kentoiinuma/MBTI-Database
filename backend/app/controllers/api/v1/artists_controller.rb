# frozen_string_literal: true

module Api
  module V1
    # アーティストに関連する情報を扱うコントローラー
    class ArtistsController < ApplicationController
      # アーティストを検索して結果を返すアクション
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
  end
end
