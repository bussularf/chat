class ApplicationController < ActionController::API
  require "rqrcode"
  require "base64"
  include Doorkeeper::Helpers::Controller
  before_action :configure_permitted_parameters, if: :devise_controller?

  def current_user
    @current_user ||= User.find(doorkeeper_token&.resource_owner_id) if doorkeeper_token
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [ :otp_attempt ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :name ])
  end
end
