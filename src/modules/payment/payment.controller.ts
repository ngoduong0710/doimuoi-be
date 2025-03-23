import { Body, Controller, Post } from '@nestjs/common'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-link')
  async createPaymentLink(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.createPaymentLink(createPaymentDto)
  }
}
