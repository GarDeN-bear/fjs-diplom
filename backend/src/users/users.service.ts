import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { IUserService } from './interfaces/user.interface';
import {
  CreateUserDto,
  SearchUserParamsDto,
  UpdateUserParamsDto,
} from './dto/user.dto';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictException('User with this email exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const userData = {
      ...data,
      passwordHash,
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User wasn not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User with this email was not found');
    }
    return user;
  }

  async findAll(params: SearchUserParamsDto): Promise<UserDocument[]> {
    const { limit, offset, email, name, contactPhone } = params;

    const filter: any = {};

    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (contactPhone) {
      filter.contactPhone = { $regex: contactPhone, $options: 'i' };
    }

    return this.userModel.find(filter).skip(offset).limit(limit).exec();
  }

  async update(
    id: string,
    updateData: UpdateUserParamsDto,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User wasn not found');
    }
  }
}
