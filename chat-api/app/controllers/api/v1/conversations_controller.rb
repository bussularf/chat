class Api::V1::ConversationsController < ApplicationController
  require "kaminari"

  before_action :doorkeeper_authorize!
  before_action :set_conversation, only: [ :show ]

  def index
    @conversations = Conversation.includes(:messages).page(params[:page]).per(2)

    render json: {
      conversations: @conversations.as_json(include: :messages),
      pagination: {
        current_page: @conversations.current_page,
        next_page: @conversations.next_page,
        prev_page: @conversations.prev_page,
        total_pages: @conversations.total_pages,
        total_count: @conversations.total_count
      }
    }
  end

  def show
    page = params[:page] || 1
    per_page = params[:per_page] || 10

    messages = @conversation.messages.includes(:user).page(page).per(per_page)

    render json: {
      conversation: @conversation,
      user: current_user,
      messages: messages.as_json(include: { user: { only: [ :id, :email ] } }),
      pagination: {
        current_page: messages.current_page,
        total_pages: messages.total_pages,
        total_messages: messages.total_count
      }
    }
  end


  def create
    @conversation = current_user.conversations.new(conversation_params)
    if @conversation.save
      render json: @conversation, status: :created
    else
      render json: { error: @conversation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_conversation
    @conversation = Conversation.includes(messages: :user).find(params[:id])
  end

  def conversation_params
    params.require(:conversation).permit(:title, :messages)
  end
end
