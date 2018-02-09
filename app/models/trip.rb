class Trip < ApplicationRecord
  belongs_to :user
  has_one :expense_tracker, dependent: :destroy
  has_many :routes, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :likers, through: :likes, source: :user

  validates :title, presence: true

  acts_as_taggable

  def check

  end

end
