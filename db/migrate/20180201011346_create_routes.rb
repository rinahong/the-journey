class CreateRoutes < ActiveRecord::Migration[5.1]
  def change
    create_table :routes do |t|
      t.string :address
      t.float :latitude
      t.float :longitude
      t.date :start_date
      t.date :end_date
      t.references :trip, foreign_key: true

      t.timestamps
    end
  end
end
