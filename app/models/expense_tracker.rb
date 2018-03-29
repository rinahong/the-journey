class ExpenseTracker < ApplicationRecord
  belongs_to :trip

  validates :category, presence: true
  validates :price, presence: true
  validates :from_currency_code, presence: true
  validate :valid_date

  # scope :order_by, -> (field) {
  #   order(field.to_sym)
  # }

  private
  def valid_date
    if date.present? && date > Date.current
      errors.add(:date, "Date should be today or before")
    end
  end
end
