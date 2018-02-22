class RouteSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers
  attributes :id, :latitude, :longitude, :duration, :trip_id, :created_at, :updated_at
  attribute :address, key: :title
  attribute :start_date, key: :start
  attribute :end_date, key: :end
  attributes :url

  def url
      "http://localhost:3000" + route_path(object.id)
  end
end
