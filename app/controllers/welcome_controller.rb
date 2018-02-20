class WelcomeController < ApplicationController
  layout "home_application"
  def index
    tags = ActsAsTaggableOn::Tag.most_used(3)
    @trip_tags_most_used = []
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
