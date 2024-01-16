Rails.application.routes.draw do
  # Routing to the create action of the RegistrationsController
  namespace :api do
    namespace :v1 do
      post '/registrations', to: 'registrations#create'
      post '/mbti', to: 'mbti#create'
      get '/mbti/:user_id', to: 'mbti#show' 
      put '/mbti/:user_id', to: 'mbti#update' 
      get '/spotify/auth', to: 'spotify#auth'
      get '/spotify/callback', to: 'spotify#callback'
      get '/spotify/search/:artist_name', to: 'artists#search'
      post '/upload_image', to: 'images#upload'
      post '/posts', to: 'posts#create'
      post '/media_works', to: 'media_works#create'
    end
  end
end