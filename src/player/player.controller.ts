import { 
  BadRequestException,
  Body,
  Controller, 
  Delete, 
  Get, 
  Logger, 
  Param, 
  Post, 
  Put, 
  Query, 
  UploadedFile, 
  UseInterceptors, 
  UsePipes, 
  ValidationPipe 
} from "@nestjs/common";
import { ClientProxySmartRanking } from "src/proxyrmq/client-proxy";
import { CreatePlayerDto } from "./dtos/create-player.dto";
import { lastValueFrom, Observable } from "rxjs";
import { UpdatePlayerDto } from "./dtos/update-player.dto";
import { ValidationParams } from "src/common/pipes/validation.pipes";
import { FileInterceptor } from "@nestjs/platform-express";
import { AwsService } from '../aws/aws.service'

@Controller('api/v1/')
export class PlayerController {
  private logger = new Logger(PlayerController.name)
  
  constructor(
    private readonly clientProxySmartRanking : ClientProxySmartRanking,
    private awsService: AwsService
  ) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

  @Post('player')
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayer: CreatePlayerDto
  ){
    this.logger.log(`createPlayerDto:${JSON.stringify(createPlayer)}`)
    const category = await lastValueFrom(
      this.clientAdminBackend
      .send('get-category', createPlayer.category)
    )

    if(category){
      await this.clientAdminBackend.emit('create-player', createPlayer)
    }else{
      throw new BadRequestException('Category not found!')
    }
  }

  @Get('player')
  getPlayer(
    @Query('playerId') _id: string
  ): Observable<any>{
    return this.clientAdminBackend.send('get-player', _id ? _id : '')
  }

  @Post('player/:_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Param('_id') _id: string
  ){

    //this.logger.log(file)

    //Check if the player is registered
    const player = await lastValueFrom(
      this.clientAdminBackend.send('get-player', _id)
    )

    if (!player) {
      throw new BadRequestException(`Player not found!`)
    }

    //Upload the file to S3 and retrieve the access URL
    const urlPhotoPlayer = await this.awsService.uploadFile(file, _id)

    //Update player entity URL attribute
    const updatePlayerDto: UpdatePlayerDto = { }
    updatePlayerDto.urlPhotoPlayer = urlPhotoPlayer.url

    await this.clientAdminBackend.emit('update-player', {id: _id, player: updatePlayerDto})

    //Return the updated player to the client
    return this.clientAdminBackend.send('get-player', _id)
  }

  @Put('player/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayer: UpdatePlayerDto,
    @Param('_id', ValidationParams) _id: string
  ){
    const category = await lastValueFrom(
      this.clientAdminBackend
      .send('get-category', updatePlayer.category)
    )

    if(category){
      await this.clientAdminBackend.emit('update-player', {
        id: _id,
        player: updatePlayer
      })
    }else{
      throw new BadRequestException('Category not found')
    }
  }

  @Delete('player/:_id')
  async deletePlayer(
    @Param('_id', ValidationParams) _id: string
  ){
    await this.clientAdminBackend.emit('delete-player', { _id })
  }

}