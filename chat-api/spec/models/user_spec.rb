require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { create(:user) }

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(user).to be_valid
    end

    it 'is not valid without an email' do
      user.email = nil
      expect(user).to_not be_valid
    end

    it 'is not valid without a password' do
      user.password = nil
      expect(user).to_not be_valid
    end
  end

  describe 'two-factor authentication' do
    before do
      user.update!(otp_required_for_login: true)
      user.save!
    end

    it 'requires OTP for login when otp_required_for_login is true' do
      expect(user.otp_required_for_login).to be true
    end

    it 'does not allow login without a valid OTP' do
      invalid_otp = '123456'
      expect(user.validate_and_consume_otp!(invalid_otp)).to be_falsey
      expect(user.consumed_timestep).to eq(0)
    end
  end
end
