class CurrencyRateFinder
  attr_accessor :historical_rate, :to_currency_code
  def initialize(historical_rate)
    @historical_rate = historical_rate
  end

  def find(currency_code)
    historical_rate[currency_code.to_sym]
  end

  def convert(from_currency_code, to_currency_code = current_user.currency_code)
    from_rate_from_base = find(from_currency_code)
    to_rate_from_base = find(to_currency_code)
    from_to_to_rate = (1 / from_rate_from_base) * to_rate_from_base
  end
end
