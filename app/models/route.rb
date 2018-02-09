class Route < ApplicationRecord
  belongs_to :trip

  def lat_lng_string
    "|#{latitude},#{longitude}"
  end
end
