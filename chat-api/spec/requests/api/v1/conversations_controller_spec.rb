require 'rails_helper'

RSpec.describe "Api::V1::Conversations", type: :request do
  let!(:user) { create(:user) }
  let!(:application) { Doorkeeper::Application.create(name: "Test App", redirect_uri: "urn:ietf:wg:oauth:2.0:oob", scopes: "public") }
  let!(:token) { Doorkeeper::AccessToken.create(resource_owner_id: user.id, application_id: application.id) }
  let!(:conversation) { create(:conversation) }

  describe "GET /api/v1/conversations" do
    it "returns a list of conversations" do
      get api_v1_conversations_path, headers: { 'Authorization' => "Bearer #{token.token}" }

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response['conversations'].size).to eq(1)
      expect(json_response['pagination']['current_page']).to eq(1)
    end
  end

  describe "GET /api/v1/conversations/:id" do
    it "returns a specific conversation" do
      get api_v1_conversation_path(conversation), headers: { 'Authorization' => "Bearer #{token.token}" }

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)
      expect(json_response['conversation']['id']).to eq(conversation.id)
    end
  end

  describe "POST /api/v1/conversations" do
    context "with valid parameters" do
      it "creates a new conversation" do
        conversation_params = { conversation: { title: "Nova conversa" } }
        post api_v1_conversations_path, params: conversation_params, headers: { 'Authorization' => "Bearer #{token.token}" }

        expect(response).to have_http_status(:created)
        json_response = JSON.parse(response.body)
        expect(json_response['title']).to eq("Nova conversa")
      end
    end

    context "with invalid parameters" do
      it "does not create a conversation with missing title" do
        conversation_params = { conversation: { title: "" } }
        post api_v1_conversations_path, params: conversation_params, headers: { 'Authorization' => "Bearer #{token.token}" }

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response['error']).to include("Title can't be blank")
      end
    end
  end
end
