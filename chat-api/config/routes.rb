Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end

  devise_for :users

  resources :users do
    collection do
      get :enable_otp
      post :verify_otp
    end
  end

  mount ActionCable.server => "/cable"

  namespace :api do
    namespace :v1 do
      resources :conversations, only: [ :index, :show, :create ] do
        resources :messages do
          collection do
            get "search", to: "messages#search"
          end
        end
      end
    end
  end
end
