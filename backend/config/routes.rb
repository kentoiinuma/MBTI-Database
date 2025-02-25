# frozen_string_literal: true

# config/routes.rb
Rails.application.routes.draw do
  # ユーザー関連
  # --------------------------------
  resources :registrations, only: :create

  resources :users, param: :clerk_id, only: %i[show update] do
    member do
      post :upload_avatar
      get :posts, to: 'posts#user_posts'
    end
    resource :mbti, only: %i[show create update], controller: 'mbti'
  end

  # 投稿関連
  # --------------------------------
  resources :posts, only: %i[index show create destroy] do
    resources :media_works, only: %i[index create]

    member do
      post :ogp, to: 'ogp#create', defaults: { format: :json }
      get :ogp_page, to: 'ogp#page'
    end
  end

  # 統計情報用エンドポイント
  # --------------------------------
  get '/media_works/statistics', to: 'media_works#statistics'

  # 外部API関連
  # --------------------------------
  get '/anilist/search/:anime_title', to: 'anilist#search'
  get '/spotify/search/:artist_name', to: 'spotify#search'
end
