class RoutesController < ApplicationController
  # before_action :authenticate_user!, except: [:show]
  before_action :set_route, only: [:show, :edit, :update, :destroy]
  # before_action :authorize_user!,
  # GET /routes
  # GET /routes.json
  def index
    @routes = Route.where(trip_id:params[:trip_id]).order(created_at: :asc)
    render json: @routes
  end

  # GET /routes/1
  # GET /routes/1.json
  def show
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
    route.start_date = DateTime.now() + rand(1...50).days
    route.end_date = route.start_date + 1.days

    p "route.address >>>>>>>>>>>>>>>>>>>> "
    p route.address

    p "route.trip_id >>>>>>>>>>>>>>>>>>>> "
    p route.trip_id

    may_success = false

    if route.save
      may_success = true
    end

    render json: {
      success: may_success,
      msg: "hello"
     }

    # respond_to do |format|
    #   if @route.save
    #     format.html { redirect_to @route, notice: 'Route was successfully created.' }
    #     format.json { render :show, status: :created, location: @route }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @route.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PATCH/PUT /routes/1
  # PATCH/PUT /routes/1.json
  def update
    respond_to do |format|
      if @route.update(route_params)
        format.html { redirect_to @route, notice: 'Route was successfully updated.' }
        format.json { render :show, status: :ok, location: @route }
      else
        format.html { render :edit }
        format.json { render json: @route.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /routes/1
  # DELETE /routes/1.json
  def destroy
    @route.destroy
    respond_to do |format|
      format.html { redirect_to routes_url, notice: 'Route was successfully destroyed.' }
      format.json { head :no_content }
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
