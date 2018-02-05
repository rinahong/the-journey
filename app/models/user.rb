class User < ApplicationRecord
  has_many :trips, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :liked_trip, through: :likes, source: :trip

  has_secure_password

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, uniqueness: true, format: VALID_EMAIL_REGEX
  validates :username, presence: true, uniqueness: true
end
