class ChangeUserIdInUserConversationsAllowNull < ActiveRecord::Migration[7.2]
  def change
    change_column_null :user_conversations, :user_id, true
  end
end
