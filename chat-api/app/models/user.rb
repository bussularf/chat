class User < ApplicationRecord
  devise :registerable, :recoverable, :rememberable, :validatable, :two_factor_authenticatable, otp_secret_encryption_key: Rails.application.credentials.active_record_encryption.primary_key
  has_many :user_conversations, dependent: :nullify
  has_many :conversations, through: :user_conversations
  has_many :messages, dependent: :nullify

  validates :email, presence: true

  belongs_to :conversation, optional: true
  before_create :set_two_factor_defaults

  def set_two_factor_defaults
    self.otp_secret = ROTP::Base32.random_base32
    self.consumed_timestep = 0
    self.otp_required_for_login = true
  end

  def otp_provisioning_uri(label)
    issuer = "Wechat"
    ROTP::TOTP.new(otp_secret).provisioning_uri("#{label}@#{issuer}")
  end
end
