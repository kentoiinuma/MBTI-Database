# frozen_string_literal: true

IMGKit.configure do |config|
  if Rails.env.production?
    config.wkhtmltoimage = '/usr/local/bin/wkhtmltoimage'
  else
    config.wkhtmltoimage = '/usr/local/bin/wkhtmltoimage'
  end
  
  config.default_options = {
    quality: 100,
    width: 1200,
    height: 630
  }
end
