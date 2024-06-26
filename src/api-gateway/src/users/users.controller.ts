import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, createUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import mongoose from 'mongoose';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  validateObjectId(id: string): boolean {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  @Get()
  lookAtDocumentation() {
    return { message: 'Refer to /documentation for details on the API' };
  }

  @ApiInternalServerErrorResponse({
    type: HttpException,
    status: HttpStatus.CONFLICT,
  })
  @ApiBody({ type: [CreateUserDto] })
  @Post('/create')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<createUserResponseDto> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (Error) {
      throw new HttpException(Error, HttpStatus.CONFLICT);
    }
  }

  @UseGuards(AuthGuard)
  @Get('all')
  findAll() {
    try {
      return this.usersService.findAllUsers();
    } catch (Error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('id/:identifier')
  findOne(@Param('identifier') identifier: string) {
    this.validateObjectId(identifier);
    try {
      return this.usersService.findUserById(identifier);
    } catch (e) {
      console.log(e);
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('exists')
  async usernameAvailable(@Body('username') username: string) {
    try {
      return { response: !(await this.usersService.usernameExists(username)) };
    } catch (e) {
      console.log(e);
      throw new HttpException('Username Taken', HttpStatus.CONFLICT);
    }
  }

  @UseGuards(AuthGuard)
  @ApiBody({ type: [UpdateUserDto] })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.validateObjectId(id);

    try {
      return this.usersService.update(id, updateUserDto);
    } catch (e) {
      throw new HttpException(
        'internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    try {
      return this.usersService.softDelete(id);
    } catch (e) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
