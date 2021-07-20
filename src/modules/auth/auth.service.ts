import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './DTOs/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(pass: string, email?: string, phone?: string) {
    let user;
    if (email || (email && phone)) {
      user = await this.userService.findOneByEmail(email);
    } else if (phone && !email) {
      user = await this.userService.findOneByPhone(phone);
    }

    if (!user) {
      return null;
    }

    const match = await AuthService.comparePassword(pass, user.password);

    if (!match) return null;

    const { password, ...result } = user['dataValues'];
    return result;
  }

  public async login(loginDto: LoginDto) {
    const result = await this.validateUser(
      loginDto.password,
      loginDto.email,
      loginDto.phone,
    );

    if (!result) return null;

    const token = await this.generateToken(result);

    return { token };
  }

  public async create(user) {
    const pass = await AuthService.hashPassword(user.password);
    const newUser = await this.userService.create({ ...user, password: pass });
    if (!newUser) return null;
    const { password, ...result } = newUser['dataValues'];
    const token = await this.generateToken(result);
    return { user: result, token };
  }

  private async generateToken(user) {
    return await this.jwtService.signAsync(user);
  }

  private static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  private static async comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
