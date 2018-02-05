class WelcomeController < ApplicationController
  def index
    tags = ActsAsTaggableOn::Tag.most_used(5)
    @trips = []
    tags.each do |tag|
      tag.taggings.each do |tagging|
        trip = Trip.find tagging.taggable_id
        unless @trips.include? trip
          @trips.push(trip)
        end

      end
    end
  end

  def about
  end
end
