class TripsController < ApplicationController
  before_action :authenticate_user!, except: [:show]
  before_action :set_trip, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:show, :create]


  # GET /trips/1
  # GET /trips/1.json
  def show
    @current_user_like = current_user.likes.find_by_trip_id(@trip)
  end

  # GET /trips/new
  def new
    @trip = Trip.new
  end

  # GET /trips/1/edit
  def edit
    @route = Route.new
  end

  # POST /trips
  # POST /trips.json
  def create
    @trip = Trip.new(trip_params)
    @trip.user = current_user
    if params[:start_date].present?
      @trip.start_date = params[:start_date]
    else
      @trip.start_date = DateTime.now() + 1.month
    end

      @trip.end_date = @trip.start_date + 2.weeks

    respond_to do |format|
      if @trip.save
        format.html { redirect_to edit_trip_path(@trip), notice: 'Trip was successfully created.' }
        format.json { render :show, status: :created, location: @trip }
      else
        format.html { render :new }
        format.json { render json: @trip.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /trips/1
  # PATCH/PUT /trips/1.json
  def update
    @tags = params[:tag_list]
    if @trip.update(trip_params)
      redirect_to @trip, notice: 'Trip was successfully updated.'
    else
      render :edit, alert: "Couldn't Update..."
    end
  end

  # DELETE /trips/1
  # DELETE /trips/1.json
  def destroy
    @trip.destroy
    respond_to do |format|
      format.html { redirect_to trips_url, notice: 'Trip was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_trip
      @trip = Trip.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def trip_params
      params.require(:trip).permit(:title, :note, :start_date, :end_date, :user_id, :tag_list)
    end

    def authorize_user!
      unless can?(:crud, @trip)
        flash[:alert] = "Access Desined: Not authorized to manage this trip"
        redirect_to home_path
      end
    end
end
