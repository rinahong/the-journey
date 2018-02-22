class SessionsController < ApplicationController
  def new
    if user_signed_in?
      redirect_to trips_path, alert: "You already signed in"
    end
  end

  def create
   user = User.find_by(email: session_params[:email])
   if user && user.authenticate(session_params[:password])
     session[:user_id] = user.id

     redirect_to user_path(current_user), notice: 'Thank you for sign in!'
   else
     flash.now[:alert] = 'Wrong email or password!'
     render :new
   end
  end

  def destroy
   session[:user_id] = nil
   redirect_to trips_path, notice: 'Signed Out!'
  end

  private
  def session_params
   params.require(:session).permit(:email, :password)
  end
end
