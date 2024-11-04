
Doorkeeper::Application.destroy_all

unless Doorkeeper::Application.exists?(uid: 'Oi7CiNdAomYnKjcark6ZVJoKfCCGG-vcjQ0bSenlmYE')
  Doorkeeper::Application.create!(
    name: 'WeChat',
    uid: 'Oi7CiNdAomYnKjcark6ZVJoKfCCGG-vcjQ0bSenlmYE',
    secret: 'J8P0NQq3wHBawrlnhPD6nce_nHlMKLUCwV0oRR-qbX0',
    redirect_uri: 'https://localhost',
    scopes: ''
  )
end

puts "Dados de seed carregados com sucesso!"
