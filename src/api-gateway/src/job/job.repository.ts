import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Job } from './entities/job.entity';
import { UpdateJobDto } from './dto/update-job.dto';
import { Employee } from '../employee/entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { Team } from '../team/entities/team.entity';

@Injectable()
export class JobRepository {
  constructor(
    @InjectModel(Job.name)
    private jobModel: Model<Job>,
  ) {}

  private isNotDeleted = {
    $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
  };

  async save(job: Job) {
    const newJob = new this.jobModel(job);
    return await newJob.save();
  }

  async findById(
    identifier: string,
  ): Promise<FlattenMaps<Job> & { _id: Types.ObjectId }> {
    const populatedFields: string[] = [
      'clientId',
      'assignedBy',
      'assignedEmployees',
      /*'inventoryUsed'*/ //TODO: When Inventory is added
    ];

    return this.jobModel
      .findOne({
        $and: [
          { _id: identifier },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .populate(populatedFields)
      .lean();
  }

  async findAll() {
    return this.jobModel
      .find({ $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] })
      .lean();
  }

  async findAllInCompany(companyId: Types.ObjectId) {
    const filter = {
      $and: [
        { companyId: companyId },
        { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      ],
    };

    return this.jobModel.find(filter).lean().exec();
  }

  jobComments = {
    path: 'comments',
    populate: [
      {
        path: 'employeeId',
        model: Employee.name,
      },
      {
        path: 'companyId',
        model: Company.name,
      },
    ],
  };

  jobTasks = {
    path: 'taskList',
    populate: [
      {
        path: 'assignedEmployees',
        model: Employee.name,
      },
    ],
  };

  jobAssignedEmployees = {
    path: 'assignedEmployees',
    populate: [
      {
        path: 'employeeIds',
        model: Employee.name,
      },
      {
        path: 'teamId',
        model: Team.name,
      },
    ],
  };

  async findAllInCompanyDetailed(
    companyId: Types.ObjectId,
    fieldsToPopulate: string[] = [
      'assignedEmployees',
      'assignedBy',
      'clientId',
      'comments',
    ],
  ) {
    const filter = {
      $and: [
        { companyId: companyId },
        { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      ],
    };

    return this.jobModel //TODO: Test
      .find(filter)
      .populate(fieldsToPopulate)
      .populate(this.jobComments)
      .populate(this.jobAssignedEmployees)
      .populate(this.jobTasks)
      .lean()
      .exec();
  }

  async exists(id: string) {
    return this.jobModel
      .findOne({
        $and: [
          { _id: id },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();
  }

  async update(id: string | Types.ObjectId, updateJobDto: UpdateJobDto) {
    return this.jobModel
      .findOneAndUpdate(
        {
          $and: [
            { _id: id },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        },
        { $set: { ...updateJobDto }, updatedAt: new Date() },
        { new: true },
      )
      .lean();
  }

  async existsInCompany(id: string, companyId: string) {
    const result = await this.jobModel
      .findOne({
        $and: [
          { _id: id },
          { companyId: new Types.ObjectId(companyId) },
          {
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
        ],
      })
      .lean();
    if (result != null && result.companyId.toString() == companyId) {
      return result;
    } else {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.jobModel
      .findOneAndUpdate(
        {
          $and: [
            { _id: id },
            {
              $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
            },
          ],
        },
        { $set: { deletedAt: new Date() } },
      )
      .lean();

    return result != null;
  }

  async findOne(id: Types.ObjectId) {
    return await this.jobModel.findOne({ _id: id }).lean().exec();
  }
  async findAllForEmployee(employeeId: Types.ObjectId) {
    const filter = {
      $and: [
        { 'assignedEmployees.employeeIds': { $in: [employeeId] } },
        this.isNotDeleted,
      ],
    };
    return await this.jobModel.find(filter).lean().exec();
  }

  async findAllForEmployeeDetailed(employeeId: Types.ObjectId) {
    const fieldsToPopulate = [
      'assignedEmployees',
      'assignedBy',
      'clientId',
      'comments',
    ];
    const filter = {
      $and: [
        { 'assignedEmployees.employeeIds': { $in: [employeeId] } },
        this.isNotDeleted,
      ],
    };
    return await this.jobModel
      .find(filter)
      .populate(fieldsToPopulate)
      .lean()
      .exec();
  }
}