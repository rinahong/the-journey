class LikesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]

  def create
    trip= Trip.find params[:trip_id]
    like = Like.new(trip: trip, user: current_user)

    if like.save
      trip.update(like_count: trip.like_count + 1)
      redirect_to trip
    else
      redirect_to trip, alert: 'Couldn\'t like the trip!'
    end
  end

  def destroy
    trip= Trip.find params[:trip_id]
    like = Like.find params[:id]
    if can? :destroy, like
      like.destroy
      trip.update(like_count: trip.like_count - 1)
      redirect_to trip_path(like.trip)
    else
      head :unauthorized
    end
  end
end
