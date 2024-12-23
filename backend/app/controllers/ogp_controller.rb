# frozen_string_literal: true

# OGP画像を生成するコントローラー
class OgpController < ApplicationController
  include ActionView::Layouts
  include ActionView::Rendering

  def show
    @post = Post.find(params[:id])
    @media_works = @post.media_works

    html = render_to_string(
      template: 'ogp/show',
      layout: false,
      locals: { media_works: @media_works, post: @post }
    )

    kit = IMGKit.new(html, width: 1200, height: 630, quality: 100)
    img = kit.to_img(:png)

    file = Tempfile.new(['ogp', '.png'], '/tmp')
    file.binmode
    file.write(img)
    file.rewind

    response = Cloudinary::Uploader.upload(file.path, public_id: "ogp_image_#{@post.id}")

    ogp_image = OgpImage.find_or_initialize_by(post: @post)
    ogp_image.update!(image_url: response['secure_url'])

    render json: { ogp_image_url: ogp_image.image_url }
  end

  def page
    @post = Post.find(params[:id])
    @ogp_image = @post.ogp_image

    render layout: false
  end
end
