FactoryBot.define do
  factory :user do
    email { "test@example.com" }
    password { "password" }
    name { "Test User" }
    otp_secret { ROTP::Base32.random_base32 }
    otp_required_for_login { false }
  end
end
