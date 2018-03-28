class AddCurrencyRateToExpenseTrackers < ActiveRecord::Migration[5.1]
  def change
    add_column :expense_trackers, :currency_rate, :float
  end
end
