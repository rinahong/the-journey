require 'rest-client'
class FixerClient
  attr_accessor :api_key, :base_url
  def initialize(api_key)
    @api_key = api_key
    @base_url = 'http://data.fixer.io/api/'
  end

  def historical(date)
    response = RestClient.get base_url + date.strftime("%Y-%m-%d") + '?access_key=' + api_key
  end
end
