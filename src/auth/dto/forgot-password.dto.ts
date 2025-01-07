import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class ForgotPasswordDto {
  @IsEmail()
  email: string
}

export class VerifyCodeDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  code: string
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string

  @IsString()
  token: string
}
