class AddFromCurrencyCodeToExpenseTrackers < ActiveRecord::Migration[5.1]
  def change
    add_column :expense_trackers, :from_currency_code, :string
  end
end
