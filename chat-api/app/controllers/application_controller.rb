class ApplicationController < ActionController::API
  require "rqrcode"
  require "base64"
  include Doorkeeper::Helpers::Controller
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_locale

  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end

  def current_user
    @current_user ||= User.find(doorkeeper_token&.resource_owner_id) if doorkeeper_token
  end

  def doorkeeper_credentials
    credentials = {
      client_id: ENV['CLIENT_ID'],
      client_secret: ENV['CLIENT_SECRET']
    }

    render json: credentials
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [ :otp_attempt ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :name ])
  end
end
