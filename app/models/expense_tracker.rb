class ExpenseTracker < ApplicationRecord
  belongs_to :trip

  # scope :search -> (category = nil, date = nil, description = nil, price = nil) {
  #   if category
  #     where("category ILIKE '%#{category}%'")
  #   elsif date
  #
  #   elsif description
  #   elsif price
  #   end
  # }

  scope :filter_by, -> (keyword) {
    where("category LIKE  '#{keyword}'")
  }


  scope :order_by, -> (field) {
    order(field.to_sym)
  }
end
