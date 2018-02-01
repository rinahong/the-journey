json.extract! route, :id, :address, :latitude, :longitude, :trip_id, :created_at, :updated_at
json.start route.start_date
json.end route.end_date
json.url trip_route_path(route.trip_id, route, format: :html)
