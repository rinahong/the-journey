class StickynotesController < ApplicationController
  before_action :set_stickynote, only: [:show, :edit, :update, :destroy]

  # GET /stickynotes.json
  def index
    @stickynotes = Stickynote.where(route_id:params[:route_id]).order(index_at: :asc)
    render json: @stickynotes
  end

  # POST /stickynotes.json
  def create
    @stickynote = Stickynote.new(stickynote_params)
    @stickynote.route_id = params[:route_id]
     if @stickynote.save
       render json: @stickynote
     else
       render json: @stickynote.errors, status: :unprocessable_entity
     end
  end

  # PATCH/PUT /stickynotes/1.json
  def update
    if @stickynote.update(stickynote_params)
      render json: @stickynote
    else
      render json: @stickynote.errors, status: :unprocessable_entity
    end
  end

  # DELETE /stickynotes/1.json
  def destroy
    if @stickynote.destroy
      render json: :ok
    else
      head :bad_request
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_stickynote
      @stickynote = Stickynote.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def stickynote_params
      params.require(:stickynote).permit(:note, :index_at, :route_id)
    end
end
