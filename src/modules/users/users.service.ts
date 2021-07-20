import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../core/constants';
import { User } from './user.entity';
import { UserDto } from './DTOs/user.dto';
import { UserParams } from './user-params';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  public async getAll(userParams: UserParams) {
    const { mail, name, offset, limit } = userParams;
    const filter: { [key: string]: any } = {};
    if (mail) {
      filter.email = {
        [Op.like]: `%${mail}%`,
      };
    }
    if (name) {
      filter.name = {
        [Op.like]: `%${name}%`,
      };
    }

    const paginationOption = {
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
    };

    return await this.userRepository.findAndCountAll({
      where: filter,
      ...paginationOption,
    });
  }

  public async findOneById(id: number) {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  public async findOneByEmail(email: string) {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  public async findOneByPhone(phone: string) {
    return await this.userRepository.findOne<User>({ where: { phone } });
  }

  public async create(user: UserDto) {
    const isExist = await this.checkEmailAndPhoneUser(user.email, user.phone);
    if (isExist) {
      return null;
    }
    return await this.userRepository.create<User>(user);
  }

  public async edit(user: UserDto, id: number) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) return null;
    return await this.userRepository.update<User>(user, { where: { id } });
  }

  public async deleteById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return await this.userRepository.destroy<User>({ where: { id } });
  }

  private async checkEmailAndPhoneUser(email: string, phone: string) {
    const user = await this.userRepository.findOne<User>({
      where: { [Op.or]: [{ email }, { phone }] },
    });
    return !!user;
  }
}
