class ExpenseTrackersController < ApplicationController
  before_action :find_trip, only: [:index, :edit, :update, :destroy, :add_form_sjr]
  before_action :set_expense_tracker, only: [:show, :edit, :update, :destroy]

  # GET /expense_trackers
  # GET /expense_trackers.json
  def index
    @expense_tracker = ExpenseTracker.new
    expenses_in_the_trip = ExpenseTracker.where(trip_id: params[:trip_id])
    @expense_trackers = expenses_in_the_trip.order(date: :asc)

    respond_to do |format|
      format.json { render json: @expense_trackers }
      format.html { @expense_trackers }
    end
    # render json: @expense_trackers
  end

  # GET /expense_trackers/1
  # GET /expense_trackers/1.json
  def show
  end

  # GET /expense_trackers/new
  def new
    @expense_tracker = ExpenseTracker.new
  end

  def add_form_sjr
    @expense_tracker = ExpenseTracker.new
    @expense_tracker.trip = @trip
    # binding.pry
    respond_to do |format|
      format.js { render 'add_form_sjr' }
    end
    # binding.pry
  end

  # GET /expense_trackers/1/edit
  def edit
  end

  # POST /expense_trackers
  # POST /expense_trackers.json
  def create
    @expense_tracker = ExpenseTracker.new expense_tracker_params
    @trip = Trip.find params[:trip_id]
    @expense_tracker.trip = @trip

    respond_to do |format|
      if @expense_tracker.save
        puts "================Im in create and if block==============="
        # format.html { redirect_to trip_expense_trackers_path(@trip), notice: 'Expense tracker was successfully created.' }
        format.js { render 'add_expense_data_sjr'}
      else
        format.html { render :new }
        format.json { render json: @expense_tracker.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /expense_trackers/1
  # PATCH/PUT /expense_trackers/1.json
  def update
    @trip = @expense_tracker.trip
    respond_to do |format|
      if @expense_tracker.update(expense_tracker_params)
        format.html { redirect_to trip_expense_trackers_path(@trip), notice: 'Expense tracker was successfully updated.' }
        format.json { render :show, status: :ok, location: @expense_tracker }
      else
        format.html { render :edit }
        format.json { render json: @expense_tracker.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /expense_trackers/1
  # DELETE /expense_trackers/1.json
  def destroy
    @expense_tracker.destroy
    respond_to do |format|
      format.html { redirect_to trip_expense_trackers_path(@trip), notice: 'Expense tracker was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_expense_tracker
      @expense_tracker = ExpenseTracker.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def expense_tracker_params
      params.require(:expense_tracker).permit(:category, :date, :description, :price)
    end

    def find_trip
      @trip = Trip.find_by(user_id:current_user)
      # @trip = Trip.find params[:expense_tracker][:trip_id]
      # @trip = Trip.find params[:trip_id]
      # binding.pry
    end

end
