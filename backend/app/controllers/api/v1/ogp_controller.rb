class OgpController < ApplicationController
    def show
      @post = Post.find(params[:id])
      @user = @post.user
      @media_works = @post.media_works
  
      html = render_to_string(template: 'ogp/show', layout: false)
      kit = IMGKit.new(html, quality: 50)
      send_data(kit.to_img(:png), type: 'image/png', disposition: 'inline')
    end
end