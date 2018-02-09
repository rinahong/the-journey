class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token
  def user_signed_in?
    if session[:user_id].present? && current_user.nil?
      session[:user_id] = nil
    end
     session[:user_id].present?
  end
  helper_method :user_signed_in?

  def current_user
    @current_user ||=User.find_by(id: session[:user_id])
  end

  helper_method :current_user

  private
  def authenticate_user!
    unless user_signed_in?
      redirect_to new_sessions_path, alert: 'You must sign in or sign up first!'
    end
  end

end
