class Trip < ApplicationRecord
  belongs_to :user
  has_many :routes, dependent: :destroy

  validates :title, presence: true
end
