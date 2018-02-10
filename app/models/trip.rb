class Trip < ApplicationRecord
  belongs_to :user
  has_many :expense_tracker, dependent: :destroy
  has_many :routes, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :likers, through: :likes, source: :user

  validates :title, presence: true

  acts_as_taggable
  
  validates :like_count, numericality: {greater_than_or_equal_to: 0}

end
