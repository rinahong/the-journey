#TODO adding edit and updating expense_tracker
class ExpenseTrackersController < ApplicationController
  before_action :find_trip, only: [:index, :create, :edit, :update]
  before_action :set_expense_tracker, only: [:show, :edit, :update, :destroy]

  # GET /expense_trackers
  # GET /expense_trackers.json
  def index
    @expense_tracker = ExpenseTracker.new
    expenses_in_the_trip = ExpenseTracker.where(trip_id:params[:trip_id])
    @expense_trackers = expenses_in_the_trip.order(date: :asc)

    respond_to do |format|
      format.json { render json: @expense_trackers } #For Chart.js Ajax
      format.html { @expense_trackers }
    end
  end

  # Post /trips/:id/add_form  -> member of trip
  def add_form_sjr
    @expense_tracker = ExpenseTracker.new
    @trip = Trip.find params[:id]
    @expense_tracker.trip = @trip
    respond_to do |format|
      format.js { render 'add_form_sjr' }
    end
  end

  # GET /expense_trackers/1/edit
  # def edit
  # end

  # POST /expense_trackers
  def create
    @expense_tracker = ExpenseTracker.new expense_tracker_params
    @trip = Trip.find params[:trip_id]
    @expense_tracker.trip = @trip
    respond_to do |format|
      if @expense_tracker.save
        format.js { render 'add_expense_data_sjr'}
      else
        format.html { render :index, alert: "Cound't create the expense tracker" }
      end
    end
  end

  # PATCH/PUT /expense_trackers/1
  # PATCH/PUT /expense_trackers/1.json
  # def update
  #   @trip = @expense_tracker.trip
  #   respond_to do |format|
  #     if @expense_tracker.update(expense_tracker_params)
  #       format.html { redirect_to trip_expense_trackers_path(@trip), notice: 'Expense tracker was successfully updated.' }
  #       format.json { render :show, status: :ok, location: @expense_tracker }
  #     else
  #       format.html { render :edit }
  #       format.json { render json: @expense_tracker.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # DELETE /expense_trackers/1
  # DELETE /expense_trackers/1.json
  def destroy
    respond_to do |format|
      if @expense_tracker.destroy
        @expense_trackers = @expense_tracker.trip.expense_trackers.order(date: :asc)
        format.js { render 'remove_expense_data_sjr', expense_trackers: @expense_trackers}
      else
        format.html { redirect_to trip_expense_trackers_path(@expense_tracker.trip), alert: 'Couldn\'t like the trip!' }
        format.json { render json: @expense_tracker.errors, status: :unprocessable_entity }
      end
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
      @trip = Trip.find params[:trip_id]
    end

end
