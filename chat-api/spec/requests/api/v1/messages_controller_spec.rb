require 'rails_helper'

RSpec.describe Api::V1::MessagesController, type: :controller do
  let!(:user) { create(:user) }
  let!(:conversation) { create(:conversation) }
  let!(:message) { create(:message, user: user, conversation: conversation) }
  let!(:application) { Doorkeeper::Application.create!(name: 'Test App', uid: 'test_app', secret: 'secret', redirect_uri: 'https://localhost') }

  before do
    @oauth_token = Doorkeeper::AccessToken.create!(resource_owner_id: user.id, application_id: application.id)
    request.headers['Authorization'] = "Bearer #{@oauth_token.token}"
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_params) { { message: { content: 'Hello!', conversation_id: conversation.id } } }
  
      it 'creates a new message' do
        expect {
          post :create, params: valid_params.merge(conversation_id: conversation.id)
        }.to change(Message, :count).by(1)
  
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']['content']).to eq('Hello!')
      end
  
      it 'broadcasts the message' do
        expect(ActionCable.server).to receive(:broadcast).with(
          "chat_channel",
          hash_including(message: hash_including("content" => "Hello!"))
        )
  
        post :create, params: valid_params.merge(conversation_id: conversation.id)
      end
    end
  end

  describe 'PUT #update' do
    context 'when the user is authorized' do
      let(:valid_update_params) { { conversation_id: conversation.id, id: message.id, message: { content: 'Updated content' } } }
  
      it 'updates the message' do
        put :update, params: valid_update_params
  
        expect(response).to have_http_status(:ok)
        expect(message.reload.content).to eq('Updated content')
      end
  
      it 'broadcasts the updated message' do
        expect(ActionCable.server).to receive(:broadcast).with(
          "chat_channel",
          hash_including(message: hash_including("content" => "Updated content"))
        )
  
        put :update, params: valid_update_params
      end
    end
  
    context 'when the user is not authorized' do
      let(:other_user) { create(:user, email: Faker::Internet.unique.email) }
      let(:unauthorized_params) { { conversation_id: conversation.id, id: message.id, message: { content: 'Unauthorized update' } } }
  
      before do
        @oauth_token = Doorkeeper::AccessToken.create!(resource_owner_id: user.id, application_id: application.id)
        request.headers['Authorization'] = "Bearer"
      end
  
      it 'does not update the message' do
        put :update, params: unauthorized_params
  
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'DELETE #destroy' do
    context 'when the user is authorized' do
      it 'deletes the message' do
        expect {
          delete :destroy, params: { conversation_id: conversation.id, id: message.id }
        }.to change(Message, :count).by(-1)

        expect(response).to have_http_status(:no_content)
      end
    end

    context 'when the user is not authorized' do
      let(:other_user) { create(:user) }

      before do
        @oauth_token = Doorkeeper::AccessToken.create!(resource_owner_id: other_user.id,  application_id: application.id)
        request.headers['Authorization'] = "Bearer #{@oauth_token.token}"
      end

      it 'does not delete the message' do
        expect {
          delete :destroy, params: { conversation_id: conversation.id, id: message.id }
        }.not_to change(Message, :count)

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #search' do
    let!(:message1) { create(:message, content: 'Search this message', conversation: conversation) }
    let!(:message2) { create(:message, content: 'Another message', conversation: conversation) }
    let!(:user) { create(:user, email: Faker::Internet.unique.email) }

    it 'returns messages matching the search query' do
      get :search, params: { conversation_id: conversation.id, query: 'Search' }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).map { |m| m['content'] }).to include('Search this message')
      expect(JSON.parse(response.body).map { |m| m['content'] }).not_to include('Another message')
    end
  end
end
