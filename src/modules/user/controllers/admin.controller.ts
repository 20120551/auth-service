import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { TokenRevalidatingInterceptor } from 'interceptors';
import { AdminUpdateUserProfileDto, CreateUserDto } from '../resources/dto';
import { UseAuthorized } from 'guards';
import { SupportedRole } from 'configurations/role.config';
import { IAdminService } from '../services';

@UseAuthorized({ roles: [SupportedRole.ADMIN] })
@UseInterceptors(TokenRevalidatingInterceptor)
@Controller('/api/admin')
export class AdminController {
  constructor(
    @Inject(IAdminService) private readonly _AdminService: IAdminService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('/users')
  async getUsers() {
    const usersResponse = await this._AdminService.getUsers();
    return usersResponse;
  }

  @HttpCode(HttpStatus.OK)
  @Get('/users/:id')
  async getUser(@Param('id') id: string) {
    const userResponse = await this._AdminService.getUser(id);
    return userResponse;
  }

  @HttpCode(HttpStatus.OK)
  @Put('/user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() adminUpdateUserProfileDto: AdminUpdateUserProfileDto,
  ) {
    const userResponse = await this._AdminService.updateUser(
      id,
      adminUpdateUserProfileDto,
    );
    return userResponse;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const userResponse = await this._AdminService.createUser(createUserDto);
    return userResponse;
  }
}
