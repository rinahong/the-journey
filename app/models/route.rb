class Route < ApplicationRecord
  belongs_to :trip
  has_many :routes

  def lat_lng_string
    "|#{latitude},#{longitude}"
  end
end
