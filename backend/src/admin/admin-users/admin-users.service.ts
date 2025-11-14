import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from '../../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AdminUsersService {
  private readonly saltRounds = 10;

  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async findAll() {
    const users = await this.userModel.find({}, 'username email role createdAt').exec();
    return users;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email, role } = createUserDto;

    // Check if user already exists
    const exists = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (exists) {
      throw new ConflictException('المستخدم موجود مسبقاً');
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hash = await bcrypt.hash(tempPassword, this.saltRounds);

    const user = await this.userModel.create({
      username,
      email,
      password: hash,
      role,
    });

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      tempPassword,
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('المستخدم غير موجود');
    }
    return { message: 'تم حذف المستخدم' };
  }
}
