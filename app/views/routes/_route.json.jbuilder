json.extract! route, :id, :address, :latitude, :longitude, :start_date, :end_date, :trip_id, :created_at, :updated_at
json.url trip_route_path(route.trip_id, route, format: :json)
