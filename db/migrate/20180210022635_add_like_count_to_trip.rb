class AddLikeCountToTrip < ActiveRecord::Migration[5.1]
  def change
    add_column :trips, :like_count, :integer, :default => 0
  end
end
