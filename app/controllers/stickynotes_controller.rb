class StickynotesController < ApplicationController
  before_action :set_stickynote, only: [:show, :edit, :update, :destroy]

  # GET /stickynotes
  # GET /stickynotes.json
  def index
    @stickynotes = Stickynote.where(route_id:params[:route_id]).order(index_at: :asc)
    render json: @stickynotes
  end

  # GET /stickynotes/1
  # GET /stickynotes/1.json
  def show
  end

  # GET /stickynotes/new
  def new
    @stickynote = Stickynote.new
  end

  # GET /stickynotes/1/edit
  def edit
  end

  # POST /stickynotes
  # POST /stickynotes.json
  def create
    @stickynote = Stickynote.new(stickynote_params)
    @stickynote.route_id = params[:route_id]
     if @stickynote.save
       render json: @stickynote
     else
       render json: @stickynote.errors, status: :unprocessable_entity
     end

    # respond_to do |format|
    #   if @stickynote.save
    #     format.html { redirect_to @stickynote, notice: 'Stickynote was successfully created.' }
    #     format.json { render :show, status: :created, location: @stickynote }
    #   else
    #     format.html { render :new }
    #     format.json { render json: @stickynote.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PATCH/PUT /stickynotes/1
  # PATCH/PUT /stickynotes/1.json
  def update
    respond_to do |format|
      if @stickynote.update(stickynote_params)
        format.html { redirect_to @stickynote, notice: 'Stickynote was successfully updated.' }
        format.json { render :show, status: :ok, location: @stickynote }
      else
        format.html { render :edit }
        format.json { render json: @stickynote.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stickynotes/1
  # DELETE /stickynotes/1.json
  def destroy
    @stickynote.destroy
    respond_to do |format|
      format.html { redirect_to stickynotes_url, notice: 'Stickynote was successfully destroyed.' }
      format.json { head :no_content }
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
