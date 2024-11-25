# frozen_string_literal: true

module Api
  module V1
    # アニメリストに関連する情報を扱うコントローラー
    class AnilistController < ApplicationController
      # アニメを検索して結果を返すアクション
      def search
        service = AnilistService.new
        media = service.search(params[:anime_title])

        if media.present?
          render json: media
        else
          render json: { error: 'Anime not found' }, status: :not_found
        end
      end
    end
  end
end