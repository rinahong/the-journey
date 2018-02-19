class WelcomeController < ApplicationController
  layout "home_application"
  def index
    tags = ActsAsTaggableOn::Tag.most_used(3)
    @trips = []
    tags.each do |tag|
      tag.taggings.each do |tagging|
        trip = Trip.find tagging.taggable_id
        unless @trips.include? trip
          @trips.push(trip)
        end
      end
    end

    @trip_highest_likes = Trip.all.order(like_count: :desc)[0..3]
  end

end
