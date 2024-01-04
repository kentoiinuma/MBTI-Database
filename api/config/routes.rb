Rails.application.routes.draw do
  # Routing to the create action of the RegistrationsController
  namespace :api do
    namespace :v1 do
      post '/registrations', to: 'registrations#create'
      post '/mbti', to: 'mbti#create'
      get '/mbti/:user_id', to: 'mbti#show' # New endpoint
    end
  end
end