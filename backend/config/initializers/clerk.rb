# frozen_string_literal: true

Clerk.configure do |c|
  c.api_key = ENV['CLERK_SECRET_KEY']
end
