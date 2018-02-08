class RoutesController < ApplicationController
  # before_action :authenticate_user!, except: [:show]
  before_action :set_route, only: [:show, :edit, :destroy]
  # before_action :authorize_user!,
  # GET /routes
  def index
    @routes = Route.where(trip_id:params[:trip_id]).order(start_date: :asc)
    render json: @routes
  end

  # GET /routes/1
  # GET /routes/1.json
  def show
    render json: @route
  end

  # GET /routes/new
  def new
    @route = Route.new
  end

  # GET /routes/1/edit
  def edit
  end

  # POST /routes
  # POST /routes.json
  def create
    route = Route.new route_params
    trip = Trip.find params[:trip_id]
    if trip.routes.empty?
      route.start_date = trip.start_date
    else
      route.start_date = trip.routes.last.end_date
    end

    if route.duration.nil?
      route.duration = rand(1..4).days
    end

    route.end_date = route.start_date + route.duration

    may_success = false

    if route.save
      may_success = true
    end

    render json: route
  end

  def move
    r = RouteMover.new(params[:id], params[:new_position])
    r.move_save!
  end

  # PATCH/PUT /routes/1
  # PATCH/PUT /routes/1.json
  def update
    date_updater (params[:delete_route_at_index])
    render json: :ok
    # if @route.update(route_params)
    #   render json: @route
    # else
    #   render json: @route.errors, status: :unprocessable_entity
    # end
  end

  # DELETE /routes/1
  # DELETE /routes/1.json
  def destroy
    if @route.destroy
      render json: :ok  #redirect_to update to update all dates
    else
      head :bad_request
    end
  end

  def date_updater
    trip = Trip.find params[:trip_id]
    @trip_routes = trip.routes.order(start_date: :asc).to_a
    dataIndex = params[:delete_route_at_index]
    puts "============all_trip_routes============================"

    routes_to_update = @trip_routes[dataIndex..@trip_routes.length]
    prev_route = @trip_routes[dataIndex-1]

    routes_to_update.each_with_index do |each_route, index|
      if dataIndex == 0
        puts dataIndex
        puts each_route.address
      #   each_route.start_date = trip.start_date
      #   each_route.end_date = each_route.start_date + each_route.duration
      #   prev_route = each_route
      else
        each_route.start_date = prev_route.end_date
        each_route.end_date = each_route.start_date + each_route.duration
        prev_route = each_route
      end
    end
    if routes_to_update.each(&:save)
      render json: :ok
    else
      render json: :unprocessable_entity
    end
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
      unless can?(:crud, @route)
        flash[:alert] = "Access Desined: Not authorized to manage this route"
        redirect_to home_path
      end
    end
end
