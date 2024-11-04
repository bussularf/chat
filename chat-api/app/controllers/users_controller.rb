class UsersController < ApplicationController
  before_action :doorkeeper_authorize!

  def index
    @users = User.all
    render json: @users
  end

  def show
    render json: current_user
  end


  def update
    user = current_user
    if params[:currentPassword].present? && params[:newPassword].present?
      if user.valid_password?(params[:currentPassword])
        if user.update(password: params[:newPassword])
          render json: { message: "Senha atualizada com sucesso." }, status: :ok
        else
          render json: { error: user.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { error: "Senha atual incorreta." }, status: :unauthorized
      end
    else
      if user.update(account_update_params)
        render json: user, status: :ok
      else
        render json: user.errors, status: :unprocessable_entity
      end
    end
  end

  def destroy
    current_user.destroy
    render json: { message: "Conta excluída com sucesso." }, status: :ok
  rescue StandardError => e
    render json: { error: "Erro ao excluir a conta: #{e.message}" }, status: :unprocessable_entity
  end

  def verify_otp
    user = User.find_by(email: current_user.email)
    if user && user.validate_and_consume_otp!(params[:otp])
      render json: { message: "OTP verificado com sucesso.", userId: current_user.id }, status: :ok
    else
      render json: { error: "Código OTP inválido." }, status: :unprocessable_entity
    end
  end

  def enable_otp
    @user = current_user

    if @user.otp_secret.blank?
      @user.otp_secret = ROTP::Base32.random_base32
      @user.save
    end

    @otp_url = @user.otp_provisioning_uri(@user.email)
    @qr_code = RQRCode::QRCode.new(@otp_url)

    png_data = @qr_code.as_png(size: 300, border_modules: 4).to_s
    base64_png = Base64.strict_encode64(png_data)

    render json: { qr_code: "data:image/png;base64,#{base64_png}" }
  end

  private

  def placeholder_user
    User.find_or_create_by(email: "deleted_user@example.com") do |u|
      u.password = SecureRandom.hex(16)
      u.name = "Usuário excluído"
    end
  end

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

  def account_update_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :current_password)
  end
end
