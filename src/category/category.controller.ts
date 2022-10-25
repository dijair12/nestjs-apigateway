import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('api/v1/')
export class CategoryController {
  private logger = new Logger(CategoryController.name)
  
  constructor(
    private readonly clientProxySmartRanking : ClientProxySmartRanking
  ) {}

  private clientAdminBackend = this.clientProxySmartRanking.getClientProxyAdminBackendInstance()

  @Post('category')
  @UsePipes(ValidationPipe)
  createCategory(
    @Body() createCategory: CreateCategoryDto
  ){
    this.logger.log(`createCategory: ${JSON.stringify(createCategory)}`)
    this.clientAdminBackend.emit('create-category', createCategory)
  }

  @Get('category')
  getCategory(
    @Query('categoryId') _id: string 
  ): Observable<any>{
  return this.clientAdminBackend.send('get-category', _id ? _id : '')
  }

  @Put('category/:_id')
  updateCategory(
    @Body() updateCategory: UpdateCategoryDto,
    @Param('_id') _id: string
  ){
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      category: updateCategory })
  }

}
