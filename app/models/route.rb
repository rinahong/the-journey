class Route < ApplicationRecord
  belongs_to :trip
  has_many :stickynotes, dependent: :destroy

  def lat_lng_string
    "|#{latitude},#{longitude}"
  end
end
