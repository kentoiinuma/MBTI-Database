# frozen_string_literal: true

Rails.application.routes.draw do
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
      get '/posts', to: 'posts#index'
      get '/posts/all', to: 'posts#all'
      get '/posts/:id', to: 'posts#show'
      post '/media_works', to: 'media_works#create'
      get '/media_works', to: 'media_works#index'
      get '/users/:id', to: 'users#show'
      put '/users/:id', to: 'users#update_name'
      get '/media_works/statistics', to: 'media_works#statistics'
      post '/users/:id/upload_avatar', to: 'users#upload_avatar'
      delete '/posts/:id', to: 'posts#destroy'
      get '/ogp/:id', to: 'ogp#show'
      get '/ogp_page/:id', to: 'ogp#page'
    end
  end
end
