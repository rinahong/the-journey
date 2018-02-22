Rails.application.routes.draw do

  get('/', { to: 'trips#index'})

  resources :users, except: [:index]
  resource :sessions, only: [:new, :create, :destroy]

  resources :trips, except: [:new] do
    resources :routes, except: [:new, :edit], shallow: true do
      member do
        patch :move
        patch :duration_update
      end
      collection do
        patch :date_updater
      end
      resources :stickynotes, only: [:index, :create, :update, :destroy], shallow: true
    end

    resources :expense_trackers, only: [:destroy], shallow: true, defaults: {format: :js}
    resources :expense_trackers, only: [:index, :edit, :create, :update], shallow: true
    resources :likes, only: [:create, :destroy], shallow: true
    member do
      post '/add_form' => "expense_trackers#add_form_sjr"
    end
  end

  match "*unmatched_route", to: 'application#not_found', via: :all
end
