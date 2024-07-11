import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, FlattenMaps, Model, Types } from 'mongoose';
import { Employee } from './entities/employee.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) {}

  async findAll() {
    return this.employeeModel.find().lean().exec();
  }

  async findAllInCompany(
    identifier: Types.ObjectId,
    fieldsToPopulate?: string[],
  ) {
    const result: (FlattenMaps<Employee> & { _id: Types.ObjectId })[] =
      await this.employeeModel
        .find({
          $and: [
            {
              companyId: identifier,
            },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .populate(fieldsToPopulate.join(' '))
        .lean();
    return result;
  }

  async findById(
    identifier: Types.ObjectId,
    fieldsToPopulate?: string[],
  ): Promise<FlattenMaps<Employee> & { _id: Types.ObjectId }> {
    console.log('In findById repository');
    console.log('identifier -> ', identifier);
    return this.employeeModel
      .findOne({
        $and: [
          { _id: identifier },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .populate(fieldsToPopulate)
      .lean();
  }

  async findByIds(
    identifiers: Types.ObjectId[],
  ): Promise<(FlattenMaps<Employee> & { _id: Types.ObjectId })[]> {
    const ids = identifiers.map((id) => new Types.ObjectId(id));

    const result: (FlattenMaps<Employee> & { _id: Types.ObjectId })[] =
      await this.employeeModel
        .find({
          $and: [
            { _id: { $in: ids } },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .lean();
    return result;
  }

  async employeeExists(id: Types.ObjectId): Promise<boolean> {
    const result: FlattenMaps<Employee> & { _id: Types.ObjectId } =
      await this.employeeModel
        .findOne({
          $and: [
            { _id: id },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .lean();

    console.log('employeeExists -> ', result);
    return result != null;
  }

  async employeeExistsForCompany(
    id: Types.ObjectId,
    companyId: Types.ObjectId,
  ): Promise<boolean> {
    const result: FlattenMaps<Employee> & { _id: Types.ObjectId } =
      await this.employeeModel
        .findOne({
          $and: [
            { _id: new Types.ObjectId(id) },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        })
        .lean();
    if (result != null && result.companyId == companyId) return true;
    return false;
  }

  async getCompanyIdFromEmployee(employeeId: Types.ObjectId) {
    const result = await this.employeeModel
      .findOne(
        { _id: new Types.ObjectId(employeeId) },
        { companyId: 1, _id: 0 },
      )
      .lean();

    return result ? result.companyId : null;
  }

  async update(id: Types.ObjectId, updateEmployeeDto: UpdateEmployeeDto) {
    const previousObject: FlattenMaps<Employee> & { _id: Types.ObjectId } =
      await this.employeeModel
        .findOneAndUpdate(
          {
            $and: [
              { _id: id },
              {
                $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
              },
            ],
          },
          { $set: { ...updateEmployeeDto }, updatedAt: new Date() },
        )
        .lean();

    return previousObject;
  }

  async remove(id: Types.ObjectId): Promise<boolean> {
    console.log('In remove repository');
    const employeeToDelete = await this.findById(id);
    console.log('employeeToDelete -> ', employeeToDelete);

    if (employeeToDelete == null) {
      return false;
    }

    const result: Document<unknown, NonNullable<unknown>, User> &
      User & { _id: Types.ObjectId } =
      await this.employeeModel.findOneAndUpdate(
        {
          $and: [
            { _id: employeeToDelete._id },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        },
        { $set: { deletedAt: new Date() } },
      );

    if (result == null) {
      return false;
    }
    return true;
  }
}