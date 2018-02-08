# RouteMover.new(trip, route_id, )

class RouteMover
  attr_accessor :route, :trip, :trip_routes, :initial_position, :new_position

  def initialize(route_id, new_position)
    @route = Route.find(route_id)
    @trip = @route.trip
    @trip_routes = @trip.routes.order(start_date: :asc).to_a
    # assume 0 based index
    @initial_position = @trip_routes.find_index(@route)
    @new_position = new_position
  end

  def move!
    return if new_position == initial_position #if its in the same place, do nothing
    delta = (initial_position - new_position).abs
    if (new_position > initial_position)
      move_down(delta)
    elsif (new_position < initial_position)
      move_up(delta)
    end
  end

  def move_down(delta)
    # define this
  end

  def move_up(steps)
    move_route_to_index!(new_position)
    recalculate_trip_route_dates
    save_trips
    # is this the first position?
    # if (new_position == 0)
    #   move_route_to_index!(0)
    #
    #   # # first deal with our route
    #   # route.start_date = trip.start_date
    #   # route.end_date = route.start_date + route.duration
    #   # #next deal with all the other routes
    #   # move_route_to_index!(0)
    #
    # else
    #   # route's start_date must be the end_date of the route above it
    #   prev_route = trip_routes[new_position-1]
    #   route.start_date = prev_route.end_date
    # end

  end

  private

    def move_route_to_index!(index)
      trip_routes.insert(index, trip_routes.delete_at(initial_position))
    end

    def recalculate_trip_route_dates
      trip_routes.each_with_index do |trip_route, index|
        if index == 0
          trip_route.start_date = trip.start_date
          trip_route.end_date = trip_route.start_date + trip_route.duration
        else
          prev_route = trip_routes[index-1]
          trip_route.start_date = prev_route.end_date
          trip_route.end_date = trip_route.start_date + prev_route.duration
        end
      end
    end

    def save_trips
      trip_routes.each(&:save)
    end




end
