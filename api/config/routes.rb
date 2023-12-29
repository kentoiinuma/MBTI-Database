Rails.application.routes.draw do
  # Routing to the create action of the RegistrationsController
  post '/registrations', to: 'registrations#create'
end