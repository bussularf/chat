FactoryBot.define do
  factory :user_conversation do
    association :user
    association :conversation
  end
end
