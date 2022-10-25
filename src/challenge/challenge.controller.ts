import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { Logger } from '@nestjs/common';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Player } from 'src/player/interfaces/player.interfaces';
import { lastValueFrom } from 'rxjs';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { ChallengeStatusValidationPipe } from './pipes/validation-status-challenge.pipe';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './challenge-status.enum';
import { AssignChallengeToGameDto } from './dtos/assign-challenge-game.dto';
import { Game } from './interfaces/game.interface';

@Controller('api/v1/challenge')
export class ChallengeController {
  private logger = new Logger(ChallengeController.name)

  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking
  ){}
  
  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()
  private clientChallenges  = this.clientProxySmartRanking.getClientProxyChallengesInstance()

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto ){
      this.logger.log(`createChallengeDto: ${JSON.stringify(createChallengeDto)}`)
      const players: Player[] = await lastValueFrom(this.clientAdminBackend.send('get-player', ''))               

      createChallengeDto.players.map(playerDto => {
        const playerFilter: Player[] = players.filter( player => player._id == playerDto._id )

        this.logger.log(`playerFilter: ${JSON.stringify(playerFilter)}`)  

        if (playerFilter.length == 0) {
          throw new BadRequestException(`Id ${playerDto._id} not found player!`)
        }
        
        if (playerFilter[0].category != createChallengeDto.category) {
          throw new BadRequestException(`Player ${playerFilter[0]._id} not part of the given category!`)
        }
      })

      const requesterIsTheGamePlayer: Player[] = createChallengeDto
        .players
        .filter(player => player._id == createChallengeDto.request )

      this.logger.log(`requesterIsTheGamePlayer: ${JSON.stringify(requesterIsTheGamePlayer)}`)

      if(requesterIsTheGamePlayer.length == 0) {
        throw new BadRequestException(`The requester must be a player of the game!`)
      }

      const category = await lastValueFrom(this.clientAdminBackend.send('get-category', createChallengeDto.category))

      this.logger.log(`category: ${JSON.stringify(category)}`)

      if (!category) {
        throw new BadRequestException(`Category not found!`)
      }

      await this.clientChallenges.emit('create-challenge', createChallengeDto)
  }

  @Get()
  async getChallenges(
    @Query('playerId') playerId: string): Promise<any> {
    if ( playerId ) {
      const player: Player = await lastValueFrom(this.clientAdminBackend.send('get-player', playerId ))
      this.logger.log(`player: ${JSON.stringify(player)}`)
      if (!playerId) {
          throw new BadRequestException(`Player not found!`)
      }
    }
    return await lastValueFrom(this.clientChallenges.send('get-challenge', { playerId: playerId , _id: '' }))
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string) {
    const challenge: Challenge = await lastValueFrom(this.clientChallenges.send('get-challenge', { playerId: '', _id: _id }))

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`)
    if (!challenge) {
      throw new BadRequestException(`challenge not found!`)
    }
    if (challenge.status !== ChallengeStatus.PENDING) {
      throw new BadRequestException ('Only challenges with PENDING status can be updated!')
    }

    await this.clientChallenges.emit('update-challenge', { id: _id, challenge: updateChallengeDto } )
    }    

  @Post('/:challenge/game/')
  async assignChallengeToGame(
    @Body(ValidationPipe) assignChallengeToGameDto: AssignChallengeToGameDto,
    @Param('challenge') _id: string
    ){
          
    const challenge: Challenge = await lastValueFrom(this.clientChallenges.send('get-challenge', { playerId: '', _id: _id }))

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`)

    if (!challenge) {
      throw new BadRequestException(`challenge não cadastrado!`)
    }
    if (challenge.status === ChallengeStatus.REALIZED) {
      throw new BadRequestException(`challenge is realized!`)  
    }
    if ( challenge.status !== ChallengeStatus.ACCEPTED) {
      throw new BadRequestException(`Matches can only be launched on challenges accepted by opponents!`)
    }
    if (!challenge.players.includes(assignChallengeToGameDto.def)) {
      throw new BadRequestException(`The winning player of the match must be part of the challenge!`)
    }

    const game: Game = {} 
    game.category = challenge.category
    game.def = assignChallengeToGameDto.def
    game.challenge = _id
    game.players = challenge.players
    game.result = assignChallengeToGameDto.result

    await this.clientChallenges.emit('create-game', game)

  }

  @Delete('/:_id')
  async deleteChallenge(
    @Param('_id') _id: string) { 
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenge', { playerId: '', _id: _id })
    )

    this.logger.log(`challenge: ${JSON.stringify(challenge)}`)
        
    if (!challenge) {
      throw new BadRequestException(`challenge not found!`)
    }

    await this.clientChallenges.emit('delete-challenge', challenge )
  }

}
