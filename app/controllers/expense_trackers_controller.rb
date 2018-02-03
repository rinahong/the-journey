class ExpenseTrackersController < ApplicationController
  before_action :set_expense_tracker, only: [:show, :edit, :update, :destroy]

  # GET /expense_trackers
  # GET /expense_trackers.json
  def index
    @expense_trackers = ExpenseTracker.all
  end

  # GET /expense_trackers/1
  # GET /expense_trackers/1.json
  def show
  end

  # GET /expense_trackers/new
  def new
    @expense_tracker = ExpenseTracker.new
  end

  # GET /expense_trackers/1/edit
  def edit
  end

  # POST /expense_trackers
  # POST /expense_trackers.json
  def create
    @expense_tracker = ExpenseTracker.new(expense_tracker_params)

    respond_to do |format|
      if @expense_tracker.save
        format.html { redirect_to @expense_tracker, notice: 'Expense tracker was successfully created.' }
        format.json { render :show, status: :created, location: @expense_tracker }
      else
        format.html { render :new }
        format.json { render json: @expense_tracker.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /expense_trackers/1
  # PATCH/PUT /expense_trackers/1.json
  def update
    respond_to do |format|
      if @expense_tracker.update(expense_tracker_params)
        format.html { redirect_to @expense_tracker, notice: 'Expense tracker was successfully updated.' }
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
      format.html { redirect_to expense_trackers_url, notice: 'Expense tracker was successfully destroyed.' }
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
      params.require(:expense_tracker).permit(:category, :date, :description, :price, :trip_id)
    end
end
