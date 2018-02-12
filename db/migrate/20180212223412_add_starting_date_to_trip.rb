class AddStartingDateToTrip < ActiveRecord::Migration[5.1]
  def change
    add_column :trips, :starting_date, :Date
  end
end
