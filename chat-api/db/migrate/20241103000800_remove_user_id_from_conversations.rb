class RemoveUserIdFromConversations < ActiveRecord::Migration[7.2]
  def change
    remove_column :conversations, :user_id, :bigint
  end
end
