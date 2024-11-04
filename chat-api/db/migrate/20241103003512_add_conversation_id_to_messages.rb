class AddConversationIdToMessages < ActiveRecord::Migration[7.2]
  def change
    add_column :messages, :conversation_id, :bigint
    add_index :messages, :conversation_id
  end
end
