Rails.application.routes.draw do
  get('/', { to: 'welcome#index', as: :home })
  get('/about', { to: 'welcome#about', as: :about })

  resources :users, except: [:index]
  resource :sessions, only: [:new, :create, :destroy]

  resources :trips, except: [:index] do
    resources :routes, shallow: true do
      member do
        patch :move
      end
      collection do
        patch :date_updater
      end
    end
    # member do
    #   patch :update_all_routes
    # end
    resources :expense_trackers, shallow: true
    resources :likes, only: [:create, :destroy], shallow: true
  end

  post '/add_form' => "expense_trackers#add_form_sjr"

end
