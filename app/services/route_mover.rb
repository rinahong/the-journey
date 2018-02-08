# r = RouteMover.new(route_id, new_position)

class RouteMover
  attr_accessor :route, :trip, :trip_routes, :initial_position, :new_position

  def initialize(route_id, new_position_index)
    @route = Route.find(route_id)
    @trip = @route.trip
    @trip_routes = @trip.routes.order(start_date: :asc).to_a
    # assume 0 based index
    @initial_position = @trip_routes.find_index(@route)
    @new_position = new_position_index
  end

  # Moving route up or down.
  def move_save!
    return if new_position == initial_position #if its in the same place, do nothing
    move_route_to_index!(new_position)
    recalculate_trip_route_dates
    save_trips
  end


  private
    def move_route_to_index!(index)
      trip_routes.insert(index, trip_routes.delete_at(initial_position))
    end

    def recalculate_trip_route_dates
      trip_routes.each_with_index do |each_route, index|
        if index == 0
          each_route.start_date = trip.start_date
          each_route.end_date = each_route.start_date + each_route.duration
        else
          prev_route = trip_routes[index-1]
          each_route.start_date = prev_route.end_date
          each_route.end_date = each_route.start_date + prev_route.duration
        end
      end
    end

    def save_trips
      trip_routes.each(&:save)
    end

end
