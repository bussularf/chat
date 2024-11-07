Doorkeeper.configure do
  orm :active_record
  api_only
  base_controller "ActionController::API"

  resource_owner_from_credentials do |routes|
    user = User.find_for_database_authentication(email: params[:username])
    user if user&.valid_password?(params[:password])
  end

  access_token_expires_in 1.day

  use_refresh_token

  grant_flows %w[password]
end
