class ChangeConversationIdInMessagesToNotNull < ActiveRecord::Migration[7.2]
  def change
    change_column_null :messages, :conversation_id, false
  end
end
