import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import * as argon2 from "argon2";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {

    }

    async create(createUserDto: CreateUserDto) {
        const findUser = await this.userRepository.findOne({
            where: {
                email: createUserDto.email
            }
        })
        if (findUser) throw new BadRequestException('This email already exist!')

        const hash = await argon2.hash(createUserDto.password)

        const user = await this.userRepository.save({
            email: createUserDto.email,
            password: hash
        })

        const payload = { id: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload)

        return { user, accessToken }
    }

    async findOne(email: string) {
        return await this.userRepository.findOne({
            where: {
                email
            }
        });
    }

}
