import { AuthTokenDto } from '@/auth/dto/auth-token.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'
import { EmailService } from '@/email/email.service'
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
  private resetCodes = new Map<string, { code: string; expires: Date }>()

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
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

    const payload = {
      sub: user.id,
      fullname: user.get('fullname'),
      avatarUrl: user.avatarUrl,
    }
    const token = this.jwtService.sign(payload)

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<number>('JWT_EXPIRATION'),
    }
  }

  async handleOAuthLogin(user: User) {
    const payload = {
      sub: user.id,
      fullname: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.avatarUrl,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn: this.configService.get<number>('JWT_EXPIRATION'),
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ id: userId })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }
    return user
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email: email })
    if (!user) {
      return
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()

    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)

    this.resetCodes.set(email, { code, expires })

    await this.emailService.sendResetPasswordCode(email, code)
  }

  async verifyResetCode(email: string, code: string): Promise<string> {
    const resetData = this.resetCodes.get(email)

    if (!resetData) {
      throw new BadRequestException('No reset code found')
    }

    if (new Date() > resetData.expires) {
      this.resetCodes.delete(email)
      throw new BadRequestException('Reset code has expired')
    }

    if (resetData.code !== code) {
      throw new BadRequestException('Invalid reset code')
    }

    this.resetCodes.delete(email)

    const token = this.jwtService.sign(
      { email, type: 'password-reset' },
      { expiresIn: '15m' }
    )

    return token
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token)

      if (payload.type !== 'password-reset') {
        throw new UnauthorizedException('Invalid token type')
      }

      const user = await this.userModel.findOne({ email: payload.email })
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      await this.userModel.findByIdAndUpdate(
        user._id,
        {
          $set: {
            password: hashedPassword,
          },
        },
        { new: true }
      )

      await this.emailService.sendPasswordChangedNotification(user.email)
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token')
      }
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired')
      }
      throw new BadRequestException('Could not reset password')
    }
  }
}
