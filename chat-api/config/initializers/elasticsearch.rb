Elasticsearch::Model.client = Elasticsearch::Client.new(
  url: ENV["ELASTICSEARCH_URL"],
  transport_options: {
    request: { timeout: 5 }
  }
)
