export interface JwtPayload {
  sub: string
  email: string
  provider?: 'local' | 'google'
  iat?: number
  exp?: number
}
