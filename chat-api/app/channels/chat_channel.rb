class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "chat_channel"
    Rails.logger.debug "Subscribed to chat_channel"
  end

  def receive(data)
    Rails.logger.debug "Data received in ChatChannel: #{data.inspect}"
    ActionCable.server.broadcast("chat_channel", data)
  end

  def typing(data)
    ActionCable.server.broadcast("chat_channel", { typing: data["typing"], user: current_user.id })
  end

  def unsubscribed
    Rails.logger.debug "Unsubscribed from chat_channel"
  end
end
