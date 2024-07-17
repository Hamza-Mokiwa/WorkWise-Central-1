import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Company } from './entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
  ) {}

  async save(company: Company) {
    const newCompanyModel = new this.companyModel(company);
    return await newCompanyModel.save();
  }

  async findById(identifier: Types.ObjectId, populatedFields?: string[]) {
    if (populatedFields) {
      return this.companyModel
        .findOne({
          $and: [
            { _id: identifier },
            { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
          ],
        })
        .populate(populatedFields)
        .lean()
        .exec();
    }

    return this.companyModel
      .findOne({
        $and: [
          { _id: identifier },
          { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
        ],
      })
      .lean()
      .exec();
  }

  async findByRegistrationNumber(
    registrationNumber: string,
  ): Promise<FlattenMaps<Company> & { _id: Types.ObjectId }> {
    return this.companyModel
      .findOne({
        $and: [
          { registrationNumber: registrationNumber },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();
  }

  async findByEmailOrName(
    identifier: string,
  ): Promise<FlattenMaps<Company> & { _id: Types.ObjectId }> {
    const regex = `${identifier}`;
    return this.companyModel
      .find({
        $and: [
          {
            $or: [{ private: false }, { private: { $exists: false } }],
          },
          {
            $or: [
              { name: { $regex: regex, $options: 'i' } },
              { 'contactDetails.email': { $regex: regex, $options: 'i' } },
            ],
          },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();
  }

  async findAll(fields?: string[]) {
    if (fields) {
      return this.companyModel
        .find({ $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] })
        .populate(fields)
        .lean();
    }

    return this.companyModel
      .find({ $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] })
      .lean();
  }

  async registrationNumberExists(registrationNumber: string): Promise<boolean> {
    const result = await this.companyModel
      .findOne({
        $and: [
          { registrationNumber: registrationNumber },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();

    return result != null;
  }

  async VatNumberExists(vatNumber: string): Promise<boolean> {
    const result = await this.companyModel
      .findOne({
        $and: [
          { vatNumber: vatNumber },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();

    return result != null;
  }

  async idExists(id: Types.ObjectId): Promise<boolean> {
    const result = await this.companyModel
      .findOne({
        $and: [
          { _id: id },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();
    return result != null;
  }

  async employeeExists(
    compId: Types.ObjectId,
    empId: Types.ObjectId,
  ): Promise<boolean> {
    const result = await this.companyModel
      .findOne({
        $and: [
          { _id: compId },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();
    if (!result) return false;

    console.log('employeeExists');
    console.log(result);
    for (const employee of result.employees) {
      if (employee.equals(empId)) {
        return true;
      }
    }

    return false;
  }

  async update(id: Types.ObjectId, updateCompanyDto: UpdateCompanyDto) {
    return this.companyModel.findOneAndUpdate(
      {
        $and: [
          { _id: id },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      },
      { $set: { ...updateCompanyDto }, updatedAt: new Date() },
      { new: true },
    );
  }

  async addEmployee(id: Types.ObjectId, employeeId: Types.ObjectId) {
    return this.companyModel.findOneAndUpdate(
      {
        $and: [
          { _id: id },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      },
      { $push: { employees: employeeId }, updatedAt: new Date() },
      { new: true },
    );
  }

  async removeEmployee(id: Types.ObjectId, employeeId: Types.ObjectId) {
    //TODO: Test
    return this.companyModel.findOneAndUpdate(
      {
        $and: [
          { _id: id },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      },
      { $pull: { employees: employeeId }, updatedAt: new Date() },
      { new: true },
    );
  }

  async delete(id: Types.ObjectId): Promise<boolean> {
    const result = await this.companyModel.findOneAndUpdate(
      {
        $and: [
          { _id: id },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      },
      { $set: { deletedAt: new Date() } },
    );

    return result != null;
  }

  async findCompanyWithEmployee(employeeId: Types.ObjectId) {
    const filter = {
      $and: [
        { employees: { $in: [employeeId] } },
        {
          $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
        },
      ],
    };
    return await this.companyModel.findOne(filter).lean().exec();
  }

  async findAllNames() {
    const filter = {
      $and: [
        { $or: [{ private: false }, { private: { $exists: false } }] },
        { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      ],
    };
    return await this.companyModel
      .find(filter)
      .select([
        'registrationNumber',
        'vatNumber',
        'name',
        'logo',
        'address.city',
        'address.province',
        'address.suburb',
        'address.street',
        'address.postalCode',
      ])
      .lean()
      .exec();
  }
}
