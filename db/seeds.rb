
Route.destroy_all
ExpenseTracker.destroy_all
Trip.destroy_all
User.destroy_all

PASSWORD = '123'

user_admin = User.create(
  username: 'admin',
  email: 'a@a.a',
  password: PASSWORD,
  # is_admin: true
)
# User Not Admin
user_not_admin = User.create(
  username: 'test',
  email: 't@t.t',
  password: PASSWORD,
  # is_admin: false
)

user_not_admin = User.create(
  username: 'test2',
  email: 't2@t.t',
  password: PASSWORD,
  # is_admin: false
)

10.times.each do
  username = Faker::Name.first_name
  User.create(
    username: username,
    email: "#{username.downcase}@example.com",
    password: PASSWORD
  )
end

users = User.all
puts Cowsay.say("Create #{users.count} users", :tux)

tags = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
  "n", "o", "p", "q", "r", "x", "t", "u", "v", "w", "x", "y", "z"]

users.each do |user|
  rand(1..3).times.each do
    tags_arr = []
    rand(0..4).times.each do
      tags_arr.push(tags.sample)
    end
    s_d = Date.new(2018,2,01) + rand(1...50).days
    Trip.create(
      title: Faker::Address.country,
      note: Faker::HarryPotter.quote,
      start_date: s_d,
      user_id: user.id,
      tag_list: tags_arr,
      like_count: rand(0..100)
    )
  end
end


trips = Trip.all
puts Cowsay.say("Created #{trips.count} trips", :ghostbusters)

trips.each do |trip|
  rand(2..5).times.each do
    if trip.routes.empty?
      s_d = trip.start_date
    else
      s_d = trip.routes.last.end_date
    end
    d = rand(1..4)
    e_d = s_d + d.days

    Route.create(
      address: "#{trip.title}",
      latitude: 39.2780017  + rand(1...12),
      longitude: -6.1203521 + rand(1...36),
      start_date: s_d,
      end_date: e_d,
      duration: d,
      trip_id: trip.id
    )
  end

  rand(3..5).times.each do
    s_d = trip.start_date + rand(1..3).days
    ExpenseTracker.create(
      category: Faker::Beer.hop,
      date: s_d,
      description: Faker::Beer.style,
      price: rand(1..200),
      trip_id: trip.id
    )
  end
end


# routes = Route.all
expenses = ExpenseTracker.all

# puts Cowsay.say("Created #{routes.count} routes", :moose)
puts Cowsay.say("Created #{expenses.count} expenses", :kitty)

rand(50..150).times.each do
  trip = trips.sample
  like = Like.new(
      trip_id: trip.id,
      user_id: users.sample.id
    )
  if like.save
    trip.update(like_count: trip.like_count + 1)
  end
end

likes = Like.all
puts Cowsay.say("Created #{likes.count} likes", :tux)

puts "Use #{user_not_admin.email} and #{PASSWORD} for testing"
