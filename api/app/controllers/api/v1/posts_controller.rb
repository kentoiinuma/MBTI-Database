import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';
import { useLocation } from 'react-router-dom';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [mediaWorks, setMediaWorks] = useState({});
  const [mbtiTypes, setMbtiTypes] = useState({}); // New state for MBTI types
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);

  let API_URL;
  if (window.location.origin === 'http://localhost:3001') {
    API_URL = 'http://localhost:3000';
  } else if (window.location.origin === 'https://favorite-database-16type-f-5f78fa224595.herokuapp.com') {
module Api
    module V1
      class PostsController < ApplicationController
        def create
          puts params[:clerk_id] 
          user = User.find_by(clerk_id: params[:clerk_id])
          if user
            post = Post.new(user_id: user.id)

            if post.save
              render json: { id: post.id }
            else
              render json: { error: post.errors.full_messages }, status: :unprocessable_entity
            end
          else
            render json: { error: "User not found" }, status: :not_found
          end
        end 

        def all
          posts = Post.all.order(created_at: :desc).includes(:user)
          render json: posts.as_json(include: { user: { only: [:clerk_id] } })
        end

        def index
          if params[:user_id]
            user = User.find_by(clerk_id: params[:user_id])
              if user
                posts = user.posts
                render json: posts
              else
                render json: { error: "User not found" }, status: :not_found
              end
            else
              render json: { error: "User ID is required" }, status: :bad_request
          end
        end
      end
    end
end