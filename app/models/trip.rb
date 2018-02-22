class Trip < ApplicationRecord
  belongs_to :user
  has_many :expense_trackers, dependent: :destroy
  has_many :routes, dependent: :destroy

  has_many :likes, dependent: :destroy
  has_many :likers, through: :likes, source: :user

  validates :title, presence: true

  acts_as_taggable

  validates :like_count, numericality: {greater_than_or_equal_to: 0}

  validate :end_date_validation

  scope :search_by_tag, -> (tag_array) {
    joins(:taggings).where("taggings.tag_id IN (:tags)", tags: tag_array).distinct
  }

  def end_date_validation
    if end_date.present? && end_date < start_date
      errors.add(:end_date, "can't before the start date")
    end
  end
end
