class Api::V1::MessagesController < ApplicationController
  before_action :doorkeeper_authorize!
  before_action :set_message, only: [ :update, :destroy ]

  def create
    @message = current_user.messages.build(message_params)
    if @message.save
      ActionCable.server.broadcast("chat_channel", {
        message: @message.as_json(include: { user: { only: [ :id, :email ] } })
      })
      render json: { message: @message, email: current_user.email, status: :created }
    else
      render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @message.user_id == current_user.id && @message.update(message_params)
      ActionCable.server.broadcast("chat_channel", {
        message: @message.as_json(include: { user: { only: [ :id, :email ] } })
      })
      render json: @message, status: :ok
    else
      render json: { error: I18n.t('messages.update.not_authorized') }, status: :unauthorized
    end
  end

  def destroy
    if @message.user_id == current_user.id
      @message.destroy
      head :no_content
    else
      render json: { error: I18n.t('messages.destroy.not_authorized') }, status: :unauthorized
    end
  end

  def search
    conversation = Conversation.find(params[:conversation_id])
    @messages = conversation.messages.where("content LIKE ?", "%#{params[:query]}%")
    render json: @messages.as_json(include: { user: { only: [ :id, :email ] } })
  end

  private

  def set_message
    @message = Message.find(params[:id])
    render json: { error: I18n.t('messages.set_message.not_found') }, status: :not_found unless @message
  end

  def message_params
    params.require(:message).permit(:content, :conversation_id)
  end
end
