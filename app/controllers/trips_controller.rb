class TripsController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :set_trip, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user!, except: [:index, :show, :create]

  layout "home_application", only: [:index]
  def index
    @trip_tags_most_used = []
    @trip_highest_likes = []
    begin
      # Get params matching tags, tag_list
      tag_list_ids = params[:tags][:tag_list]
      # First one is always empty string. Not an tag id.
      # If tag list has at least one tag name to search
      if tag_list_ids.length > 1
        # Remove first empty string element in tag_list array
        tag_list_ids.shift
        @trip_tags_most_used = Trip.search_by_tag(tag_list_ids)
      else
        #If user sumbit search tag form with empty input. Then return all Trips
        @trip_tags_most_used = Trip.all.order(like_count: :desc)
      end
    rescue
      #Return All trips which contain the most_used tag names
      tags = ActsAsTaggableOn::Tag.most_used(3)
      tags.each do |tag|
        tag.taggings.each do |tagging|
          trip = Trip.find tagging.taggable_id
          unless @trip_tags_most_used.include? trip
            @trip_tags_most_used.push(trip)
          end
        end
      end
      @trip_highest_likes = Trip.all.order(like_count: :desc)[0..3]
    end
  end


  # GET /trips/1
  def show
    @current_user_like = current_user.likes.find_by_trip_id(@trip)
  end


  # GET /trips/1/edit
  def edit
  end

  # POST /trips
  def create
    @trip = Trip.new(trip_params)
    @trip.user = current_user
    unless @trip.start_date.present?
      @trip.start_date = DateTime.now() + 1.month
    end

    if @trip.save
      redirect_to edit_trip_path(@trip), notice: 'Trip was successfully created.'
    else
      redirect_to edit_trip_path(@trip), alert: @trip.errors.full_messages.join(', ')
    end
  end

  # PATCH/PUT /trips/1
  def update
    @tags = params[:tag_list]
    if @trip.update(trip_params)
      recalculate_trip_route_dates(@trip.routes, @trip)
      redirect_to edit_trip_path(@trip), notice: 'Trip was successfully updated.'
    else
      redirect_to edit_trip_path(@trip), alert: @trip.errors.full_messages.join(', ')
    end
  end

  # DELETE /trips/1
  def destroy
    if @trip.destroy
      redirect_to user_path(@trip.user), notice: 'Trip was successfully destroyed.'
    else
      redirect_to user_path(@trip.user), alert: 'Could\'t delete your trip'
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
        redirect_to trips_path
      end
    end

    def recalculate_trip_route_dates (trip_routes, trip)
      trip_routes.each_with_index do |each_route, index|
        if index == 0
          each_route.start_date = trip.start_date
          each_route.end_date = each_route.start_date + each_route.duration
        else
          prev_route = trip_routes[index-1]
          each_route.start_date = prev_route.end_date
          each_route.end_date = each_route.start_date + each_route.duration
        end
      end
      trip_routes.each(&:save)
    end
end
