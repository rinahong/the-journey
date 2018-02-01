# json.extract! trip, :id, :title, :note, :start_date, :end_date, :user_id, :created_at, :updated_at
json.array! trip.routes do |r|
  json.extract! r, :id, :latitude, :longitude, :trip_id, :created_at, :updated_at
  json.title r.address
  json.start r.start_date
  json.end r.end_date
  json.url trip_route_path(trip.id, r, format: :html)
end
# json.url trip_url(trip, format: :json)
