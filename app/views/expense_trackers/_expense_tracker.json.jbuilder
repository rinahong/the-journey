json.extract! expense_tracker, :id, :category, :date, :description, :price, :trip_id, :created_at, :updated_at
json.url expense_tracker_url(expense_tracker, format: :json)
