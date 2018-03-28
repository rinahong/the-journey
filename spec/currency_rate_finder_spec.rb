require 'rails_helper'
# CurrencyRateFinder#initialize(rate_client, default_code)
# CurrencyRateFinder#find(from, to)
#
# FixerClient#initialize(api_key,default_base_code)
# FixerClient#historical(currency_code, date, default_base_code=@default_base_code)

RSpec.describe CurrencyRateFinder do
  let(:record) { CurrencyRateFinder.new() }

  describe '#initialize' do
    context 'with signed in user' do
      before do
        request.session[:user_id] = user.id
      end
      #.........
    end
    context 'with valid parameters' do
      it 'creates a new campaign in the database' do
        count_before = Campaign.count
        valid_request
        count_after = Campaign.count

        expect(count_before).to eq(count_after - 1)
      end

      it 'associates the campaign with the signed in user' do
        valid_request
        expect(Campaign.last.user).to eq(user)
      end
    end
    context 'with invalid parameters' do
      def invalid_request
        post :create, params: {
          campaign: FactoryBot.attributes_for(:campaign).merge({title: nil})
        }
      end
    end

    end
  end
end
