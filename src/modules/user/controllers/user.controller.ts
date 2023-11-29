import { Controller, Inject } from '@nestjs/common';
import { IUserService } from '../services';

@Controller('/api/user')
export class UserController {
  constructor(
    @Inject(IUserService) private readonly _userService: IUserService,
  ) {}
}
