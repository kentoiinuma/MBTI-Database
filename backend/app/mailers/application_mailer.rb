# frozen_string_literal: true

# アプリケーション全体で使用するメーラーの基底クラス
class ApplicationMailer < ActionMailer::Base
  default from: 'from@example.com'
  layout 'mailer'
end
