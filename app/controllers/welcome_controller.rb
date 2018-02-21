class WelcomeController < ApplicationController
  layout "home_application", only: [:index]
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

    # Parameters: {"utf8"=>"✓", "tags"=>{"tag_list"=>["", "21", "20"]}, "commit"=>"Submit!"}
    # Get params matching tags
     # a["tags"]["tag_list"]
    # search_tag_list = params[:tags][:tag_list]
    # if search_tags_params
    #   puts "============================="
    #   puts search_tags_params
    #   puts search_tags_params.is_a? Array
    #   # Get a type of keyword: search_name, tags_ids, tech_size
    #   tag_list_ids = search_tags_params.keys.first
    #   keyword = search_tags_params[keyword_type]
    #   if keyword_type == "tag_ids"
    #     @organizations = Organization.search_by_tag(keyword.map{|kw| kw if kw.present?})
    #   end
    # else
    #     @organizations = Organization.all.order(name: :asc).page(params[:page]).per_page(@itensPerPage)
    #     @totalItens = Organization.all.count;
    # end

    @trip_highest_likes = Trip.all.order(like_count: :desc)[0..3]
  end

end
