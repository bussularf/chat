class ChangeUserIdNullInMessages < ActiveRecord::Migration[7.2]
  def change
    change_column_null :messages, :user_id, true
  end
end
