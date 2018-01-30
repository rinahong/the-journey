Rails.application.routes.draw do

  resources :routes
  get('/', { to: 'welcome#index', as: :home })
  get('/about', { to: 'welcome#about', as: :about })

  resources :users, except: [:index]
  resource :sessions, only: [:new, :create, :destroy]

  resources :trips


end
