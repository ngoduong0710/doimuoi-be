import { AuthTokenDto } from '@/auth/dto/auth-token.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'
import { User } from '@/modules/users/schemas/user.schema'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    })
    if (existingUser) {
      throw new BadRequestException('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    const newUser = new this.userModel({
      email: registerDto.email,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phone: registerDto.phone,
      avatarUrl: registerDto.avatarUrl,
    })

    try {
      const savedUser = await newUser.save()
      return savedUser
    } catch (error) {
      throw new BadRequestException('Failed to register user')
    }
  }

  async login(loginDto: LoginDto): Promise<AuthTokenDto> {
    const user = await this.userModel.findOne({ email: loginDto.email })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password
    )
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = { sub: user.id, email: user.email }
    const token = this.jwtService.sign(payload)

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<number>('JWT_EXPIRATION'),
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId)
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return user
  }
}
