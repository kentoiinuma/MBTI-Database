# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # ユーザー関連
      # --------------------------------
      post '/registrations',              to: 'registrations#create'
      get  '/users/:id',                  to: 'users#show'
      put  '/users/:id',                  to: 'users#update_name'
      post '/users/:id/upload_avatar',    to: 'users#upload_avatar'

      # MBTI関連
      # --------------------------------
      post '/mbti',                       to: 'mbti#create'
      get  '/mbti/:clerk_id',             to: 'mbti#show'
      put  '/mbti/:clerk_id',             to: 'mbti#update'

      # 投稿関連
      # --------------------------------
      post   '/posts',                    to: 'posts#create'
      get    '/posts',                    to: 'posts#index'
      get    '/posts/:id',                to: 'posts#show'
      delete '/posts/:id',                to: 'posts#destroy'
      get '/users/:clerk_id/posts',        to: 'posts#user_posts'

      # メディア作品関連
      # --------------------------------
      post '/media_works',                          to: 'media_works#create'
      get  '/posts/:post_id/media_works',           to: 'media_works#index'
      get  '/media_works/statistics',               to: 'media_works#statistics'

      # 外部API連携
      # --------------------------------
      get '/anilist/search/:anime_title', to: 'anilist#search'
      get '/spotify/search/:artist_name', to: 'spotify#search'

      # OGP関連
      # --------------------------------
      get '/ogp/:id',                     to: 'ogp#show'
      get '/ogp_page/:id',                to: 'ogp#page'
    end
  end
end