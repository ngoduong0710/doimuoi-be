import { AuthService } from '@/auth/auth.service'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { AuthTokenDto } from '@/auth/dto/auth-token.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import { RegisterDto } from '@/auth/dto/register.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'
import { User } from '@/modules/users/schemas/user.schema'
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'

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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user
  }
}
