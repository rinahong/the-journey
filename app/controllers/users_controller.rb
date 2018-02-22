  #TODO When Admin feature added, Destroy method will be used. (Now not using destroy)
class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:new, :create]
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, only: [:show, :edit, :update, :destroy]

  # GET /users/1
  def show
    @trips = Trip.where(user_id:current_user).order(created_at: :desc)
    @trip = Trip.new
  end

  # GET /users/new
  def new
    if user_signed_in?
      redirect_to trips_path, alert: "You already have an account!"
    else
      @user = User.new
    end
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to new_sessions_path, notice: 'User was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      redirect_to @user, notice: 'User was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
    redirect_to users_url, notice: 'User was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation)
    end

    def authorize_user!
      unless can?(:rud, @user)
        flash[:alert] = "Access Desined: Not authorized to view this account"
        redirect_to trips_path
      end
    end
end
