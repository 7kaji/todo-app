class ApplicationController < ActionController::API
  before_action :valid_request?

  def valid_request?
    token = request.headers['Authorization'].try(:split, 'Bearer ')
    head :unauthorized and return if token.blank?

    user = ::CognitoJwtVerifier.new(token[1])
    if user.validate_and_decrypt == false
      head :unauthorized and return
    end
  end
end
