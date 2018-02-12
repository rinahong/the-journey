class ChangeStartDateFromTrips < ActiveRecord::Migration[5.1]
  def change
    change_column :trips, :start_date, :date
    remove_column :trips, :starting_date, :date
  end
end
