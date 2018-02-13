class RouteSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :latitude, :longitude, :trip_id, :created_at, :updated_at
  attribute :address, key: :title
  attribute :start_date, key: :start
  attribute :end_date, key: :end
  attributes :url

  def url
    {
      # self: route_path(object.id)
      # json.url route_path(trip.id, r, format: :html)
      self: route_path(object.trip_id, object, format: :html)
    }
  end
end
