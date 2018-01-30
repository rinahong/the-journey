Rails.application.routes.draw do

  get('/', { to: 'welcome#index', as: :home })
  get('/', { to: 'welcome#about', as: :about })

  resources :users
  resource :sessions

  resources :trips


end
