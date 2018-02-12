class ChangeStartDateFromRoute < ActiveRecord::Migration[5.1]
  def change
    change_column :routes, :start_date, :date
  end
end
