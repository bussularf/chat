require "sidekiq"
require "sidekiq-cron"

Sidekiq.configure_server do |config|
  Sidekiq.configure_server do |config|
    config.on(:startup) do
      Sidekiq::Cron::Job.load_from_hash(
        "generate_doorkeeper_token" => {
          cron: "0 0,12 * * *",
          class: "GenerateDoorkeeperTokenJob"
        }
      )
  
      GenerateDoorkeeperTokenJob.perform_async
    end
  end
end
