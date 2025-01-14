import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreatePaymentDto } from './dto/create-payment.dto'

@Injectable()
export class PaymentService {
  private domain: string

  constructor(private configService: ConfigService) {
    this.domain = this.configService.get('DOMAIN')
  }

  async createPaymentLink(createPaymentDto: CreatePaymentDto) {
    const PayOS = require('@payos/node')
    const payOS = new PayOS(
      this.configService.get('PAYOS_CLIENT_ID'),
      this.configService.get('PAYOS_API_KEY'),
      this.configService.get('PAYOS_CHECKSUM_KEY')
    )

    const paymentData = {
      orderCode: Number(String(Date.now()).slice(-6)),
      amount: createPaymentDto.amount,
      description: createPaymentDto.description || 'Thanh toan don hang',
      items: createPaymentDto.items || [],
      returnUrl: createPaymentDto.returnUrl || `${this.domain}/success.html`,
      cancelUrl: createPaymentDto.cancelUrl || `${this.domain}/cancel.html`,
      buyerName: createPaymentDto.buyerName,
      buyerEmail: createPaymentDto.buyerEmail,
      buyerPhone: createPaymentDto.buyerPhone,
      buyerAddress: createPaymentDto.buyerAddress,
      expiredAt: Math.floor(Date.now() / 1000) + 600,
    }

    try {
      const response = await payOS.createPaymentLink(paymentData)
      return response
    } catch (error) {
      throw new Error(error)
    }
  }
}
