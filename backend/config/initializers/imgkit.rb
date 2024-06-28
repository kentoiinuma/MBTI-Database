IMGKit.configure do |config|
  config.wkhtmltoimage = Rails.env.production? ? Gem.bin_path('wkhtmltoimage-binary', 'wkhtmltoimage') : '/usr/local/bin/wkhtmltoimage'
  config.default_options = {
    quality: 100,
    width: 1200,
    height: 630
  }
end
