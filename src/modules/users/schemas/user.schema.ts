import { BaseSchema, schemaOptions } from '@/common/schemas/base.schema'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema(schemaOptions)
export class User extends BaseSchema {
  @Prop({ required: true, unique: true, trim: true })
  email: string

  @Prop()
  password?: string

  @Prop({ required: true, trim: true })
  firstName: string

  @Prop({ required: true, trim: true })
  lastName: string

  @Prop({ trim: true })
  phone?: string

  @Prop()
  avatarUrl?: string

  @Prop({ required: true, enum: ['local', 'google'], default: 'local' })
  provider: string

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`
  }
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('fullname').get(function () {
  return `${this.lastName} ${this.firstName}`
})

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ phone: 1 }, { sparse: true })
