module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user if request.params[:token].present?
    end

    private

    def find_verified_user
      token = request.params[:token]
      access_token = Doorkeeper::AccessToken.by_token(token)

      if access_token
        Rails.logger.debug "Access Token Found: #{access_token.token}, Accessible: #{access_token.accessible?}, User ID: #{access_token.resource_owner_id}"

        if access_token.accessible?
          user = User.find_by(id: access_token.resource_owner_id)
          return user if user
        end
      else
        Rails.logger.debug "Access Token not found for token: #{token}"
      end

      reject_unauthorized_connection
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.debug "User not found: #{e.message}"
      reject_unauthorized_connection
    end
  end
end
