import { IsArray, IsOptional, IsUrl, MaxLength, Min } from 'class-validator'

export class PaymentItemDto {
  name: string

  @Min(1)
  quantity: number

  @Min(0)
  price: number
}

export class CreatePaymentDto {
  orderCode: number

  @Min(0)
  amount: number

  @MaxLength(255, {
    message:
      'Description must not exceed 9 characters for non-payOS linked bank accounts',
  })
  description: string

  @IsOptional()
  buyerName?: string

  @IsOptional()
  buyerEmail?: string

  @IsOptional()
  buyerPhone?: string

  @IsOptional()
  buyerAddress?: string

  @IsOptional()
  @IsArray()
  items?: PaymentItemDto[]

  @IsUrl()
  cancelUrl: string

  @IsUrl()
  returnUrl: string

  @IsOptional()
  expiredAt?: number

  signature: string
}
