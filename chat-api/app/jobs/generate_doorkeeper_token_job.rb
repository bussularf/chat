class GenerateDoorkeeperTokenJob
  include Sidekiq::Worker

  def perform
    app = Doorkeeper::Application.find_or_create_by(
      name: 'Wechat',
      uid: ENV['CLIENT_ID'],
      secret: ENV['CLIENT_SECRET'],
      redirect_uri: 'http://localhost:3000/oauth/token'
    )

    if app.persisted?
      Rails.logger.info "Doorkeeper Application created or found: #{app.inspect}"
    else
      Rails.logger.error "Falha ao criar ou encontrar a aplicação do Doorkeeper! Erros: #{app.errors.full_messages.join(', ')}"
    end
  end
end
