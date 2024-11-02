Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end

  devise_for :users
  # get "current_user", to: "application#current_user"
  post "/verify_otp", to: "application#verify_otp"
  get "/enable_otp", to: "application#enable_otp"


  mount ActionCable.server => "/cable"

  namespace :api do
    namespace :v1 do
      resources :messages
    end
  end
end
