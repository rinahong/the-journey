class StcikynotesController < ApplicationController
  before_action :set_sticky_note, only: [:show, :edit, :update, :destroy]
  def index
    @sticky_notes = Stickynote.where(route_id:params[:route_id]).order(index_at: :asc)
    render json: @sticky_notes
  end

  def create
  end

  def update
  end

  def destroy
  end 

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sticky_note
      @route = Route.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sticky_note_params
      params.permit(:note, :index_at, :route_id)
    end
end
