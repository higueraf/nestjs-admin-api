import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from './user-token.entity';

import { uuid } from 'uuidv4';

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  async findOne(where: any): Promise<UserToken | null> {
    return await this.userTokenRepository.findOne(where);
  }

  create(userToken: UserToken): Promise<UserToken> {
    userToken.UserTokenID = uuid();
    userToken.CreatedAt = new Date();
    return this.userTokenRepository.save(userToken);
  }
}
