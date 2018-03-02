
class RoutesController < ApplicationController
  before_action :authenticate_user!, only: [:show]
  before_action :set_route, only: [:show, :edit, :destroy, :move, :duration_update]
  before_action :authorize_user!, only: [:show]

  # GET /routes.json
  def index
    @routes = Route.where(trip_id:params[:trip_id]).order(start_date: :asc)
    render json: @routes
  end

  # GET /routes/1
  # GET /routes/1.json
  def show
    respond_to do |format|
      format.json {@route}
      format.html {render :show}
    end
  end

  # POST /routes.json
  def create
    route = Route.new route_params
    trip = Trip.find params[:trip_id]

    if trip.routes.empty?
      # If it's the first route of the trip,
      route.start_date = trip.start_date
    else
      # If it's not first route of the trip, then route's start_date = previous route's end_date
      route.start_date = trip.routes.last.end_date
    end

    # Default duration is 3 days
    if route.duration.nil?
      route.duration = 3
    end

    route.end_date = route.start_date + route.duration.days

    if route.save
      trip.update(end_date: route.end_date)
    else
      flash.now[:alert] = 'Something went wrong. Please try again'
    end

    render json: route
  end

  def move
    # passing @route.id but this doesn't do anything
    r = RouteUpdater.new(params[:id], params[:new_position], @route.duration)
    r.move_save!
  end

  def duration_update
    trip = Trip.find params[:trip_id]
    r = RouteUpdater.new(@route.id, params[:new_position], params[:new_duration])
    r.duration_save!
    @routes = Route.where(trip_id:params[:trip_id]).order(start_date: :asc)
    trip.end_date = @routes.last.end_date
    trip.save!
    render json: @routes
  end

  # DELETE /routes/1.json
  def destroy
    if @route.destroy
      render json: :ok
    else
      head :bad_request
    end
  end

  #Update all routes' start_date and end_date if any of changes(delete) happen in trip routes.
  def date_updater
    trip = Trip.find params[:trip_id]
    @trip_routes = trip.routes.order(start_date: :asc).to_a
    dataIndex = params[:delete_route_at_index]

    # If there is at least one route in the trip
    unless @trip_routes.empty?
      # If the first route is deleted in the trip,
      if dataIndex == 0
        # Next one becomes the first route of the trip
        first_route = @trip_routes[0]
        # Update start and end dates
        first_route.start_date = trip.start_date
        first_route.end_date = first_route.start_date + first_route.duration
        first_route.save

        # Get rest of all elements from index at 1
        routes_to_update = @trip_routes[1..@trip_routes.length]
        prev_route = first_route
      else # Get all elements from the dataIndex
        routes_to_update = @trip_routes[dataIndex..@trip_routes.length]
        prev_route = @trip_routes[dataIndex-1]
      end

      #Iterate the all elements to update start and end dates
      routes_to_update.each_with_index do |each_route, index|
          each_route.start_date = prev_route.end_date
          each_route.end_date = each_route.start_date + each_route.duration
          prev_route = each_route
      end
      # Save all chagnes
      routes_to_update.each(&:save)
    end

    #trip's end_date should be updated to last route's end_date
    if trip.routes.empty?
      trip.end_date = trip.start_date
    else
      trip.end_date = trip.routes.last.end_date
    end

    trip.save!
    render json: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_route
      @route = Route.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def route_params
      params.permit(:address, :latitude, :longitude, :start_date, :end_date, :trip_id)
    end

    def authorize_user!
      route = Route.find params[:id]
      trip = route.trip
      unless can?(:crud, @route)
        flash[:alert] = "Access Desined: Not authorized to manage this route"
        redirect_to trip_path(trip)
      end
    end
end
