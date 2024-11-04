Doorkeeper::Application.destroy_all

Doorkeeper::Application.create(
  name: 'WeChat',
  uid: 'Oi7CiNdAomYnKjcark6ZVJoKfCCGG-vcjQ0bSenlmYE',
  secret: 'J8P0NQq3wHBawrlnhPD6nce_nHlMKLUCwV0oRR-qbX0',
  redirect_uri: 'https://localhost',
  scopes: ''
)


User.create!(
  email: 'user1@example.com',
  password: 'password',
  password_confirmation: 'password',
  otp_required_for_login: true,
)

User.create!(
  email: 'user2@example.com',
  password: 'password',
  password_confirmation: 'password',
  otp_required_for_login: true,
)

puts "Dados de seed carregados com sucesso!"
