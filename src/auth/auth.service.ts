import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as argon2 from 'argon2'
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) throw new UnauthorizedException('User with this email not found!')
    const passwordIsMatch = await argon2.verify(user.password, password)

    if (user && passwordIsMatch) {
      return user
    }
    throw new UnauthorizedException('User or password incorrect')
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email };
    return {
      ...payload,
      access_token: this.jwtService.sign(payload),
    };
  }
}
