class ChangeEndDateFromRoutes < ActiveRecord::Migration[5.1]
  def change
    change_column :routes, :end_date, :date
  end
end
