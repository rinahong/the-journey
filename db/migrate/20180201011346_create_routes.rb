class CreateRoutes < ActiveRecord::Migration[5.1]
  def change
    create_table :routes do |t|
      t.string :address
      t.float :latitude
      t.float :longitude
      t.datetime :start_date
      t.datetime :end_date
      t.references :trip, foreign_key: true

      t.timestamps
    end
  end
end
