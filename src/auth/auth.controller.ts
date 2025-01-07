import { AuthService } from '@/auth/auth.service'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { AuthTokenDto } from '@/auth/dto/auth-token.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import { User } from '@/modules/users/schemas/user.schema'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyCodeDto,
} from './dto/forgot-password.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<AuthTokenDto> {
    return this.authService.login(loginDto)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.handleOAuthLogin(req.user)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email)
    return { message: 'If the email exists, a reset code has been sent' }
  }

  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  async verifyResetCode(@Body() dto: VerifyCodeDto) {
    const token = await this.authService.verifyResetCode(dto.email, dto.code)
    return { token }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password)
    return { message: 'Password has been reset successfully' }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user
  }
}
