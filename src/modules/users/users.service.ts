import { ChangePasswordDto } from '@/modules/users/dto/change-password'
import { CreateUserDto } from '@/modules/users/dto/create-user.dto'
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto'
import { User } from '@/modules/users/schemas/user.schema'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    })
    if (existingUser) {
      throw new BadRequestException('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    })

    try {
      const savedUser = await newUser.save()
      return savedUser
    } catch (error) {
      throw new BadRequestException('Failed to create user')
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec()
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      })
      if (existingUser) {
        throw new BadRequestException('Email already exists')
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec()

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return updatedUser
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    )
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect')
    }

    const hashedNewPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      10
    )
    user.password = hashedNewPassword
    await user.save()
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
  }
}
