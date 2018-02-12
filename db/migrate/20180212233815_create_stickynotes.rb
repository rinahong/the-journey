class CreateStickynotes < ActiveRecord::Migration[5.1]
  def change
    create_table :stickynotes do |t|
      t.text :note
      t.integer :index_at
      t.references :route, foreign_key: true

      t.timestamps
    end
  end
end
