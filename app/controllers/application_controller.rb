class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token
  rescue_from StandardError, with: :standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

  def not_found # when no route matches
    redirect_to trips_path, alert: 'COULDN\'T FIND THE PAGE'
  end

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

  # Get ENVIRONMENT value from heroku
  def environment
    if Rails.env.production?
      @environment = 'production'
    end
  end

  private
    def authenticate_user!
      unless user_signed_in?
        redirect_to new_sessions_path, alert: 'You must sign in or sign up first!'
      end
    end

  protected
    def record_not_found(error)
      redirect_to trips_path, alert: error.message
    end

    def standard_error(error)
      redirect_to trips_path, alert: error.message
    end

    def record_invalid(error)
     record = error.record
     errors = record.errors.map do |field, message|
       {
         type: error.class.to_s,
         record_type: record.class.to_s,
         field: field,
         message: message
       }
     end
     redirect_to trips_path, alert: errors.message
    end

end
