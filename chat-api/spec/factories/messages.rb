FactoryBot.define do
  factory :message do
    content { "Hello" }
    association :user
    association :conversation
  end
end
