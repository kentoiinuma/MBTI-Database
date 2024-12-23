# frozen_string_literal: true

require 'action_controller/test_case'
require 'json'

namespace :ogp do
  desc '既存の投稿に対してOGP画像を生成する'
  task generate_images: :environment do
    Post.all.each do |post|
      puts "投稿ID: #{post.id} のOGP画像を生成中..."

      begin
        controller = Api::V1::OgpController.new
        controller.request = ActionDispatch::TestRequest.create
        controller.response = ActionDispatch::TestResponse.new
        controller.params = { id: post.id }

        result = controller.show

        puts "コントローラーの結果: #{result.inspect}"

        parsed_result = JSON.parse(result, symbolize_names: true)

        if parsed_result.is_a?(Hash) && parsed_result[:ogp_image_url].present?
          puts "投稿ID: #{post.id} のOGP画像が正常に生成されました。URL: #{parsed_result[:ogp_image_url]}"

          # OGP画像データがogp_imagesテーブルに保存されたか確認
          ogp_image = OgpImage.find_by(post_id: post.id)
          if ogp_image
            puts "OGP画像データがogp_imagesテーブルに保存されました。ID: #{ogp_image.id}"
          else
            puts '警告: OGP画像データがogp_imagesテーブルに保存されていません。'
          end
        else
          puts "投稿ID: #{post.id} のOGP画像生成に失敗しました。結果: #{parsed_result.inspect}"
        end
      rescue StandardError => e
        puts "投稿ID: #{post.id} の処理中にエラーが発生しました: #{e.message}"
        puts e.backtrace.join("\n")
      end

      sleep 1
    end
  end
end
