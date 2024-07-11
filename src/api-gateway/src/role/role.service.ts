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
    console.log('role -> ', role);

    if ('permissionSuite' in role && role.permissionSuite) {
      for (const permission of role.permissionSuite) {
        if (!this.permissionsArray.includes(permission.toString())) {
          console.log('one');
          throw new ConflictException('Invalid permission');
        }
      }
    }
    console.log('a');
    if ('companyId' in role && role.companyId) {
      console.log('CompanyID is set');
      if (!(await this.companyService.companyIdExists(role.companyId))) {
        console.log('two');
        throw new ConflictException('Company not found');
      }
      console.log('a.b');
      if ('roleName' in role && role.roleName) {
        console.log('roleName is set');
        try {
          if (await this.findOneInCompany(role.roleName, role.companyId)) {
            console.log('three');
            throw new ConflictException('Role already exists');
          }
        } catch (error) {}
      }
      console.log('if is done');
    }

    console.log('b');
    if ('roleId' in role && role.roleId) {
      console.log('roleid is set');
      const flag = await this.roleExists(role.roleId as Types.ObjectId);
      if (!flag) {
        console.log('four');
        throw new ConflictException('Role not found');
      }
    }
    console.log('Validate finished');
  }

  async create(createRoleDto: CreateRoleDto) {
    try {
      await this.validateRole(createRoleDto);
    } catch (error) {
      console.log('Throwing error');
      throw new InternalServerErrorException(error);
    }

    const newRole = new Role(createRoleDto);
    newRole.roleName = createRoleDto.roleName;
    newRole.companyId = createRoleDto.companyId;
    newRole.permissionSuite = createRoleDto.permissionSuite;

    const model = new this.roleModel(newRole);
    return await model.save();
  }

  async createDefaultRoles(companyId: Types.ObjectId) {
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
    adminRoleDto.permissionSuite.push('view all inventory');
    adminRoleDto.permissionSuite.push('record inventory use');

    await this.create(adminRoleDto);

    // Foreman
    const foremanRoleDto = new CreateRoleDto();
    foremanRoleDto.companyId = companyId;
    foremanRoleDto.roleName = 'Foreman';
    adminRoleDto.permissionSuite.push('view all employees under me');
    foremanRoleDto.permissionSuite.push('view all jobs under me');
    foremanRoleDto.permissionSuite.push('view all jobs assigned to me');
    foremanRoleDto.permissionSuite.push('edit all jobs');
    foremanRoleDto.permissionSuite.push('edit jobs that are under me');
    foremanRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    foremanRoleDto.permissionSuite.push('add a new job');
    foremanRoleDto.permissionSuite.push('view all clients under me');
    foremanRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    foremanRoleDto.permissionSuite.push('edit all clients that are under me');
    foremanRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    foremanRoleDto.permissionSuite.push('view all inventory');
    foremanRoleDto.permissionSuite.push('record inventory use');

    await this.create(foremanRoleDto);

    // Team Leader
    const teamRoleDto = new CreateRoleDto();
    teamRoleDto.companyId = companyId;
    teamRoleDto.roleName = 'Team leader';
    teamRoleDto.permissionSuite.push('edit all employees');
    teamRoleDto.permissionSuite.push('view all jobs assigned to me');
    teamRoleDto.permissionSuite.push('edit all jobs');
    teamRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    teamRoleDto.permissionSuite.push('view all clients');
    teamRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    teamRoleDto.permissionSuite.push('edit all clients');
    teamRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    teamRoleDto.permissionSuite.push('view all inventory');
    teamRoleDto.permissionSuite.push('record inventory use');

    await this.create(teamRoleDto);

    // Inventory manager
    const inventoryRoleDto = new CreateRoleDto();
    inventoryRoleDto.companyId = companyId;
    inventoryRoleDto.roleName = 'Inventory manager';
    inventoryRoleDto.permissionSuite.push('view all inventory');
    inventoryRoleDto.permissionSuite.push('edit all inventory');
    inventoryRoleDto.permissionSuite.push('add a new inventory item');
    inventoryRoleDto.permissionSuite.push('record inventory use');

    await this.create(inventoryRoleDto);

    // Worker
    const workerRoleDto = new CreateRoleDto();
    workerRoleDto.companyId = companyId;
    workerRoleDto.roleName = 'Worker';
    workerRoleDto.permissionSuite.push('view all jobs assigned to me');
    workerRoleDto.permissionSuite.push('edit jobs that are assigned to me');
    workerRoleDto.permissionSuite.push(
      'view all clients that are assigned to me',
    );
    workerRoleDto.permissionSuite.push('edit all clients');
    workerRoleDto.permissionSuite.push('edit all clients that are under me');
    workerRoleDto.permissionSuite.push(
      'edit all clients that are assigned to me',
    );
    workerRoleDto.permissionSuite.push('view all inventory');
    workerRoleDto.permissionSuite.push('record inventory use');

    await this.create(workerRoleDto);
  }

  async findAll() {
    return this.roleRepository.findAll();
  }

  getPermissionsArray(): string[] {
    return this.permissionsArray;
  }

  async findAllInCompany(companyId: Types.ObjectId) {
    const result = await this.roleRepository.findAllInCompany(companyId);
    if (result == null) {
      throw new NotFoundException('The company does not have any roles');
    }
    return result;
  }

  async findOneInCompany(name: string, companyId: Types.ObjectId) {
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
    identifier: Types.ObjectId,
  ): Promise<FlattenMaps<Role> & { _id: Types.ObjectId }> {
    const result = await this.roleRepository.findById(identifier);
    if (result == null) {
      throw new NotFoundException('Role not found');
    }
    return result;
  }

  async update(id: Types.ObjectId, updateRoleDto: UpdateRoleDto) {
    try {
      await this.validateRole(updateRoleDto);
    } catch (error) {
      return `${error}`;
    }
    return this.roleRepository.update(id, updateRoleDto);
  }

  async roleExists(id: Types.ObjectId): Promise<boolean> {
    return await this.roleRepository.roleExists(id);
  }

  async roleExistsInCompany(
    id: Types.ObjectId,
    companyId: Types.ObjectId,
  ): Promise<boolean> {
    return await this.roleRepository.roleExistsInCompany(id, companyId);
  }

  async remove(id: Types.ObjectId): Promise<boolean> {
    return this.roleRepository.remove(id);
  }
}