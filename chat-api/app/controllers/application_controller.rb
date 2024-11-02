class ApplicationController < ActionController::API
  require "rqrcode"
  require "base64"
  include Doorkeeper::Helpers::Controller
  before_action :configure_permitted_parameters, if: :devise_controller?

  def current_user
    @current_user ||= User.find(doorkeeper_token&.resource_owner_id) if doorkeeper_token
  end

  def verify_otp
    user = User.find_by(email: current_user.email)
    if user && user.validate_and_consume_otp!(params[:otp])
      # Sucesso, OTP válido
      render json: { message: "OTP verificado com sucesso." }, status: :ok
    else
      # Falha, OTP inválido
      render json: { error: "Código OTP inválido." }, status: :unprocessable_entity
    end
  end

  def enable_otp
    @user = current_user

    # Garante que o segredo OTP é gerado apenas quando o usuário quer ativar
    if @user.otp_secret.blank?
      @user.otp_secret = ROTP::Base32.random_base32
      @user.save
    end

    # Gera a URL de provisão OTP para o app autenticador
    @otp_url = @user.otp_provisioning_uri(@user.email)

    # Gera o QR code com o otp_url
    @qr_code = RQRCode::QRCode.new(@otp_url)

    # Converte o QR code em PNG e em seguida para Base64
    png_data = @qr_code.as_png(size: 300, border_modules: 4).to_s
    base64_png = Base64.strict_encode64(png_data)

    # Retorna o QR code como uma string Base64
    render json: { qr_code: "data:image/png;base64,#{base64_png}" }
  end

  private

  # Verifica se o OTP é necessário para o login
  def require_otp
    if current_user&.otp_required_for_login && !session[:otp_verified]
      render json: { error: "OTP is required" }, status: :unauthorized
    end
  end

  def generate_access_token(user)
    token = Doorkeeper::AccessToken.create(resource_owner_id: user.id, expires_in: 2.hours)
    Rails.logger.info("Token gerado: #{token.token}") # Adicione isso para verificar o token gerado
    token
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_in, keys: [ :otp_attempt ])
  end
end
