import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Role } from './entity/role.entity';
import { CompanyService } from '../company/company.service';
import { EmployeeService } from '../employee/employee.service';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  private permissionsArray: string[] = [];

  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
    @Inject(forwardRef(() => RoleRepository))
    private roleRepository: RoleRepository,
  ) {
    this.permissionsArray.push('view all employees');
    this.permissionsArray.push('view employees under me');
    this.permissionsArray.push('edit all employees');
    this.permissionsArray.push('edit employees under me');
    this.permissionsArray.push('add new employees');
    this.permissionsArray.push('view all jobs');
    this.permissionsArray.push('view all jobs under me');
    this.permissionsArray.push('view all jobs assigned to me');
    this.permissionsArray.push('edit all jobs');
    this.permissionsArray.push('edit jobs that are under me');
    this.permissionsArray.push('edit jobs that are assigned to me');
    this.permissionsArray.push('add a new job');
    this.permissionsArray.push('view all clients');
    this.permissionsArray.push('view all clients under me');
    this.permissionsArray.push('view all clients that are assigned to me');
    this.permissionsArray.push('edit all clients');
    this.permissionsArray.push('edit all clients that are under me');
    this.permissionsArray.push('edit all clients that are assigned to me');
    this.permissionsArray.push('view all inventory');
    this.permissionsArray.push('edit all inventory');
    this.permissionsArray.push('add a new inventory item');
    this.permissionsArray.push('record inventory use');
  }

  async validateRole(role: Role | CreateRoleDto | UpdateRoleDto) {
    if ('permissionSuite' in role && role.permissionSuite) {
      for (const permission of role.permissionSuite) {
        if (!this.permissionsArray.includes(permission.toString())) {
          throw new ConflictException('Invalid permission');
        }
      }
    }
    if ('companyId' in role && role.companyId) {
      if (!(await this.companyService.companyIdExists(role.companyId))) {
        throw new ConflictException('Company not found');
      }
      if ('roleName' in role && role.roleName) {
        if (
          await this.findOneInCompany(role.roleName, role.companyId.toString())
        ) {
          throw new ConflictException('Role already exists');
        }
      }
    }
    if ('roleId' in role && role.roleId) {
      if (!(await this.roleExists(role.roleId.toString()))) {
        throw new ConflictException('Role not found');
      }
    }
  }

  async create(createRoleDto: CreateRoleDto) {
    try {
      await this.validateRole(createRoleDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    const newRole = new Role(createRoleDto);
    newRole.roleName = createRoleDto.roleName;
    newRole.companyId = createRoleDto.companyId;
    newRole.permissionSuite = createRoleDto.permissionSuite;

    const model = new this.roleModel(newRole);
    return await model.save();
  }

  async createDefualtRoles(companyId: Types.ObjectId) {
    // Owner role
    const ownerRoleDto = new CreateRoleDto();
    ownerRoleDto.companyId = companyId;
    ownerRoleDto.roleName = 'Owner';
    ownerRoleDto.permissionSuite = this.permissionsArray; //Full permissions

    await this.create(ownerRoleDto);

    // Admin role
    const adminRoleDto = new CreateRoleDto();
    adminRoleDto.companyId = companyId;
    adminRoleDto.roleName = 'Admin';
    adminRoleDto.permissionSuite.push('view all employees');
    adminRoleDto.permissionSuite.push('view employees under me');
    adminRoleDto.permissionSuite.push('edit all employees');
    adminRoleDto.permissionSuite.push('edit employees under me');
    adminRoleDto.permissionSuite.push('view all jobs');
    adminRoleDto.permissionSuite.push('view all jobs under me');
    adminRoleDto.permissionSuite.push('view all jobs assigned to me');
    adminRoleDto.permissionSuite.push('edit all jobs');
    adminRoleDto.permissionSuite.push('edit jobs that are under me');
    adminRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    adminRoleDto.permissionSuite.push('add a new job');
    adminRoleDto.permissionSuite.push('view all clients');
    adminRoleDto.permissionSuite.push('view all clients under me');
    adminRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    adminRoleDto.permissionSuite.push('edit all clients');
    adminRoleDto.permissionSuite.push('edit all clients that are under me');
    adminRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    adminRoleDto.permissionSuite.push('record inventory use');

    await this.create(adminRoleDto);

    // Foreman
    const foremanRoleDto = new CreateRoleDto();
    foremanRoleDto.companyId = companyId;
    foremanRoleDto.roleName = 'Foreman';
    adminRoleDto.permissionSuite.push('view all employees under me');
    foremanRoleDto.permissionSuite.push('view all jobs');
    foremanRoleDto.permissionSuite.push('view all jobs under me');
    foremanRoleDto.permissionSuite.push('view all jobs assigned to me');
    foremanRoleDto.permissionSuite.push('edit all jobs');
    foremanRoleDto.permissionSuite.push('edit jobs that are under me');
    foremanRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    foremanRoleDto.permissionSuite.push('add a new job');
    foremanRoleDto.permissionSuite.push('view all clients');
    foremanRoleDto.permissionSuite.push('view all clients under me');
    foremanRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    foremanRoleDto.permissionSuite.push('edit all clients');
    foremanRoleDto.permissionSuite.push('edit all clients that are under me');
    foremanRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    foremanRoleDto.permissionSuite.push('view all inventory');
    foremanRoleDto.permissionSuite.push('edit all inventory');
    foremanRoleDto.permissionSuite.push('add a new inventory item');
    foremanRoleDto.permissionSuite.push('record inventory use');

    await this.create(foremanRoleDto);

    // Team Leader
    const teamRoleDto = new CreateRoleDto();
    teamRoleDto.companyId = companyId;
    teamRoleDto.roleName = 'Team leader';
    teamRoleDto.permissionSuite.push('view all employees');
    teamRoleDto.permissionSuite.push('edit employees');
    teamRoleDto.permissionSuite.push('add new employees');
    teamRoleDto.permissionSuite.push('view all jobs');
    teamRoleDto.permissionSuite.push('view all jobs under me');
    teamRoleDto.permissionSuite.push('view all jobs assigned to me');
    teamRoleDto.permissionSuite.push('edit all jobs');
    teamRoleDto.permissionSuite.push('edit jobs that are under me');
    teamRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    teamRoleDto.permissionSuite.push('add a new job');
    teamRoleDto.permissionSuite.push('view all clients');
    teamRoleDto.permissionSuite.push('view all clients under me');
    teamRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    teamRoleDto.permissionSuite.push('edit all clients');
    teamRoleDto.permissionSuite.push('edit all clients that are under me');
    teamRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    teamRoleDto.permissionSuite.push('view all inventory');
    teamRoleDto.permissionSuite.push('edit all inventory');
    teamRoleDto.permissionSuite.push('add a new inventory item');
    teamRoleDto.permissionSuite.push('record inventory use');

    await this.create(teamRoleDto);

    // Inventory manager
    const inventoryRoleDto = new CreateRoleDto();
    inventoryRoleDto.companyId = companyId;
    inventoryRoleDto.roleName = 'Inventory manager';
    inventoryRoleDto.permissionSuite.push('view all employees');
    inventoryRoleDto.permissionSuite.push('edit employees');
    inventoryRoleDto.permissionSuite.push('add new employees');
    inventoryRoleDto.permissionSuite.push('view all jobs');
    inventoryRoleDto.permissionSuite.push('view all jobs under me');
    inventoryRoleDto.permissionSuite.push('view all jobs assigned to me');
    inventoryRoleDto.permissionSuite.push('edit all jobs');
    inventoryRoleDto.permissionSuite.push('edit jobs that are under me');
    inventoryRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    inventoryRoleDto.permissionSuite.push('add a new job');
    inventoryRoleDto.permissionSuite.push('view all clients');
    inventoryRoleDto.permissionSuite.push('view all clients under me');
    inventoryRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    inventoryRoleDto.permissionSuite.push('edit all clients');
    inventoryRoleDto.permissionSuite.push('edit all clients that are under me');
    inventoryRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    inventoryRoleDto.permissionSuite.push('view all inventory');
    inventoryRoleDto.permissionSuite.push('edit all inventory');
    inventoryRoleDto.permissionSuite.push('add a new inventory item');
    inventoryRoleDto.permissionSuite.push('record inventory use');

    await this.create(inventoryRoleDto);

    // Worker
    const workerRoleDto = new CreateRoleDto();
    workerRoleDto.companyId = companyId;
    workerRoleDto.roleName = 'Worker';
    workerRoleDto.permissionSuite.push('view all employees');
    workerRoleDto.permissionSuite.push('edit employees');
    workerRoleDto.permissionSuite.push('add new employees');
    workerRoleDto.permissionSuite.push('view all jobs');
    workerRoleDto.permissionSuite.push('view all jobs under me');
    workerRoleDto.permissionSuite.push('view all jobs assigned to me');
    workerRoleDto.permissionSuite.push('edit all jobs');
    workerRoleDto.permissionSuite.push('edit jobs that are under me');
    workerRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    workerRoleDto.permissionSuite.push('add a new job');
    workerRoleDto.permissionSuite.push('view all clients');
    workerRoleDto.permissionSuite.push('view all clients under me');
    workerRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    workerRoleDto.permissionSuite.push('edit all clients');
    workerRoleDto.permissionSuite.push('edit all clients that are under me');
    workerRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    workerRoleDto.permissionSuite.push('view all inventory');
    workerRoleDto.permissionSuite.push('edit all inventory');
    workerRoleDto.permissionSuite.push('add a new inventory item');
    workerRoleDto.permissionSuite.push('record inventory use');

    await this.create(workerRoleDto);
  }

  async findAll() {
    return this.roleRepository.findAll();
  }

  getPermissionsArray(): string[] {
    return this.permissionsArray;
  }

  async findAllInCompany(companyId: string) {
    return this.roleRepository.findAllInCompany(companyId);
  }

  async findOneInCompany(name: string, companyId: string) {
    const result = await this.roleModel.findOne({
      roleName: name,
      companyId: companyId,
    });
    if (result == null) {
      throw new NotFoundException('Role not found');
    }
    return result;
  }

  async findById(
    identifier: string | Types.ObjectId,
  ): Promise<FlattenMaps<Role> & { _id: Types.ObjectId }> {
    const result = await this.roleRepository.findById(identifier);
    if (result == null) {
      throw new NotFoundException('Role not found');
    }
    return result;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      await this.validateRole(updateRoleDto);
    } catch (error) {
      return `${error}`;
    }
    return this.roleRepository.update(id, updateRoleDto);
  }

  async roleExists(id: string): Promise<boolean> {
    return await this.roleRepository.roleExists(id);
  }

  async roleExistsInCompany(id: string, companyId: string): Promise<boolean> {
    return await this.roleRepository.roleExistsInCompany(id, companyId);
  }

  async remove(id: string): Promise<boolean> {
    return this.roleRepository.remove(id);
  }
}
