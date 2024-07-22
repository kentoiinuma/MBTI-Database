require 'http'
require 'open-uri'
require 'base64'

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
        image_url = anime['images']['recommended_url'] || anime['images']['facebook']['og_image_url']
        
        begin
          image_data = URI.open(image_url).read
          image_base64 = Base64.strict_encode64(image_data)
          render json: { 
            anime: {
              id: anime['id'],
              title: anime['title'],
              image: "data:image/png;base64,#{image_base64}"
            }
          }
        rescue OpenURI::HTTPError => e
          render json: { error: "Failed to fetch image: #{e.message}" }, status: :bad_request
        end
      else
        render json: { error: 'Anime not found' }, status: :not_found
      end
    else
      render json: { error: 'API request failed' }, status: :bad_request
    end
  end
end