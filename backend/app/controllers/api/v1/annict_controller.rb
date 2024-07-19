class Api::V1::AnnictController < ApplicationController
  def search
    query = params[:query]
    access_token = ENV['ANNICT_ACCESS_TOKEN']
    
    url = "https://api.annict.com/v1/works?filter_title=#{query}&access_token=#{access_token}"
    response = HTTP.get(url)
    
    if response.status.success?
      data = JSON.parse(response.body.to_s)
      anime = data['works'].first
      
      if anime
        render json: { 
          anime: {
            id: anime['id'],
            title: anime['title'],
            image: anime['images']['recommended_url']
          }
        }
      else
        render json: { error: 'Anime not found' }, status: :not_found
      end
    else
      render json: { error: 'API request failed' }, status: :bad_request
    end
  end
end
