# frozen_string_literal: true

# api/app/controllers/api/v1/users_controller.rb

module Api
  module V1
    class UsersController < ApplicationController
      def show
        clerk_id = params[:id]
        clerk = Clerk::SDK.new

        begin
          clerk_user = clerk.users.find(clerk_id)
          # Accessing hash keys instead of calling methods
          render json: {
            profile_image_url: clerk_user['profile_image_url'],
            username: clerk_user['username']
          }
        rescue StandardError => e
          Rails.logger.error "Error: #{e.message}"
          render json: { error: 'Unable_to_fetch_user_data' }, status: :unprocessable_entity
        end
      end
    end
  end
end
