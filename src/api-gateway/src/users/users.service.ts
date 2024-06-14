import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateUserDto, createUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Document, FlattenMaps, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.usernameExists(createUserDto.username)) {
      throw new ConflictException(
        'Username already exists, please use another one',
      );
    }

    const newUserObj = new User(createUserDto);
    const newUser = new this.userModel(newUserObj);
    const result = await newUser.save();

    return new createUserResponseDto(
      `${result.personalInfo.firstName} ${result.personalInfo.surname}'s account has been created`,
    );
  }

  async findAllUsers() {
    try {
      return this.userModel.find().exec();
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Users could not be retrieved');
    }
  }

  async usernameExists(identifier: string): Promise<boolean> {
    const result: FlattenMaps<User> & { _id: Types.ObjectId } =
      await this.userModel
        .findOne({
          $and: [
            { 'systemDetails.username': identifier },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .lean();

    console.log('usernameExists -> ', result);
    return result != null;
  }

  async userIdExists(id: string): Promise<boolean> {
    const result: FlattenMaps<User> & { _id: Types.ObjectId } =
      await this.userModel
        .findOne({
          $and: [
            { _id: id },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .lean();

    console.log('userIdExists -> ', result);
    return result == null;
  }

  async findUserById(
    identifier: string | Types.ObjectId,
  ): Promise<FlattenMaps<User> & { _id: Types.ObjectId }> {
    const result: FlattenMaps<User> & { _id: Types.ObjectId } =
      await this.userModel
        .findOne({
          $and: [
            { _id: identifier },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .lean();

    if (result == null) {
      throw new NotFoundException(
        'Error: User not found, please verify your username and password',
      );
    }

    return result;
  }

  async findUserByUsername(
    identifier: string,
  ): Promise<FlattenMaps<User> & { _id: Types.ObjectId }> {
    const result: FlattenMaps<User> & { _id: Types.ObjectId } =
      await this.userModel
        .findOne({
          $and: [
            { 'systemDetails.username': identifier },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .lean();

    if (result == null) {
      throw new NotFoundException(
        'Error: User not found, please verify your username and password',
      );
    }

    return result;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<FlattenMaps<User> & { _id: Types.ObjectId }> {
    /*    updateUserDto.updatedAt = new Date();
    console.log('updateUserDto');
    console.log(updateUserDto);*/

    const previousObject: FlattenMaps<User> & { _id: Types.ObjectId } =
      await this.userModel
        .findOneAndUpdate(
          {
            $and: [
              { _id: id },
              {
                $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
              },
            ],
          },
          { $set: { ...updateUserDto }, updatedAt: new Date() },
        )
        .lean();
    if (previousObject == null) {
      throw new NotFoundException('failed to update user');
    }
    return previousObject;
  }

  async softDelete(id: string): Promise<boolean> {
    const result: Document<unknown, NonNullable<unknown>, User> &
      User & { _id: Types.ObjectId } = await this.userModel.findOneAndUpdate(
      {
        $and: [
          {
            $or: [{ _id: id }, { 'systemDetails.username': id }],
          },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      },
      { $set: { deletedAt: new Date() } },
    );

    if (result == null) {
      throw new InternalServerErrorException('Internal server Error');
    }
    return true;
  }
}
