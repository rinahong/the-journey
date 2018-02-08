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
    end

    resources :expense_trackers, shallow: true
    resources :likes, only: [:create, :destroy], shallow: true
  end

end
