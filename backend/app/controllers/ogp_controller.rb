class OgpController < ApplicationController
  include ActionView::Layouts
  include ActionView::Rendering

  before_action :set_post, only: %i[create page]

  def create
    @media_works = @post.media_works
    html = render_to_string(
      template: 'ogp/show',
      layout: false,
      locals: { media_works: @media_works, post: @post },
      formats: [:html]
    )

    kit = IMGKit.new(html, width: 1200, height: 630, quality: 100)
    img = kit.to_img(:png)

    file = Tempfile.new(['ogp', '.png'], '/tmp')
    file.binmode
    file.write(img)
    file.rewind

    cloudinary_response = Cloudinary::Uploader.upload(
      file.path,
      public_id: "ogp_image_#{@post.id}"
    )
    file.close
    file.unlink

    ogp_image = OgpImage.find_or_initialize_by(post: @post)
    ogp_image.update!(image_url: cloudinary_response['secure_url'])

    # 結果は返さず、単にステータス200 (OK) を返す
    head :ok
  end

  def page
    @ogp_image = @post.ogp_image
    render layout: false
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end
end

