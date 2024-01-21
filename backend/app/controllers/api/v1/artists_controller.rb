module Api
    module V1
      class ArtistsController < ApplicationController
        def search
          artist_name = params[:artist_name]
          spotify_service = SpotifyService.new
          artist = spotify_service.search_artist(artist_name)
  
          if artist
            render json: { artist: artist }
          else
            render json: { error: 'Artist not found' }, status: :not_found
          end
        end
      end
    end
  end


