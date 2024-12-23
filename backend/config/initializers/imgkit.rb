# frozen_string_literal: true

IMGKit.configure do |config|
  config.wkhtmltoimage = if Rails.env.production?
                           '/app/bin/wkhtmltoimage'
                         else
                           '/usr/local/bin/wkhtmltoimage'
                         end
end
