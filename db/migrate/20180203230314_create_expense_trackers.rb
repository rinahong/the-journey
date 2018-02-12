class CreateExpenseTrackers < ActiveRecord::Migration[5.1]
  def change
    create_table :expense_trackers do |t|
      t.string :category, index: true
      t.date :date
      t.text :description
      t.float :price
      t.references :trip, foreign_key: true, index: true

      t.timestamps
    end
  end
end
