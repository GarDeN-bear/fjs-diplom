import { User } from '../schemas/user.schema';
import { CreateUserDto, SearchUserParamsDto } from '../dto/user.dto';

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface IUserService {
  create(data: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParamsDto): Promise<User[]>;
}
