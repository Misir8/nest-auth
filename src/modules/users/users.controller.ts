import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserParams } from './user-params';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  public async getAll(@Query() userParams: UserParams) {
    return await this.usersService.getAll(userParams);
  }

  @Delete(':id')
  public async deleteById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    const result = await this.usersService.deleteById(id);
    if (!result) {
      throw new NotFoundException('User Not Found');
    }
    return result;
  }
}
