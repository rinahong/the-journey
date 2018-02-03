Rails.application.routes.draw do


  resources :expense_trackers
  get('/', { to: 'welcome#index', as: :home })
  get('/about', { to: 'welcome#about', as: :about })

  resources :users, except: [:index]
  resource :sessions, only: [:new, :create, :destroy]

  resources :trips, except: [:index] do
    resources :routes, shallow: true
    resources :expense_trackers, shallow: true
  end

end
