import { generateUUID } from '@/common/utils/utils'
import { Prop, Schema, SchemaOptions } from '@nestjs/mongoose'

export const schemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      const { _id, __v, ...rest } = ret
      return rest
    }
  },
}

@Schema()
export class BaseSchema {
  @Prop({
    type: String,
    default: generateUUID,
    required: true,
    unique: true,
  })
  id: string

  @Prop({
    type: Boolean,
    default: false,
    required: true,
  })
  isDelete: boolean
}
