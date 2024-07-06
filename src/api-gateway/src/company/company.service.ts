import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
} from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Company } from './entities/company.entity';
import { JoinedCompany } from '../users/entities/user.entity';
import { AddUserToCompanyDto } from './dto/add-user-to-company.dto';
import { CompanyRepository } from './company.repository';
import { ValidationResult } from '../auth/entities/validationResult.entity';
import { EmployeeService } from '../employee/employee.service';
import { RoleService } from '../role/role.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<Company>,

    private readonly companyRepository: CompanyRepository,
    @Inject(forwardRef(() => EmployeeService))
    private readonly employeeService: EmployeeService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => RoleService))
    private readonly roleService: RoleService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const inputValidated = await this.companyCreateIsValid(createCompanyDto);
    if (!inputValidated.isValid) {
      throw new NotFoundException(inputValidated.message);
    }

    // createCompanyDto.createdAt = new Date();
    const newCompany = new Company(createCompanyDto);
    const newCompanyModel = new this.companyModel(newCompany);

    const createdCompany = await newCompanyModel.save();

    //Create first role in company
    const allPermissions = this.roleService.getPermissionsArray();

    const createdRole = await this.roleService.create({
      companyId: createdCompany._id,
      roleName: 'owner',
      permissionSuite: allPermissions,
    });

    const employee = await this.employeeService.create({
      userId: createCompanyDto.userId,
      companyId: createdCompany._id,
      superiorId: null,
      roleId: createdRole._id,
    });

    const user = await this.usersService.getUserById(createCompanyDto.userId);
    const newJoinedCompany = new JoinedCompany(
      employee._id,
      createdCompany._id,
      createdCompany.name,
    );
    user.joinedCompanies.push(newJoinedCompany);
    await this.usersService.updateUser(user._id, {
      joinedCompanies: user.joinedCompanies,
      currentEmployee: employee._id,
    });

    newCompany.employees.push(employee._id);
    await newCompanyModel.save();

    return new CreateCompanyResponseDto(createdCompany);
  }

  async companyRegNumberExists(registerNumber: string): Promise<boolean> {
    return this.companyRepository.registrationNumberExists(registerNumber);
  }

  async companyVatNumberExists(registerNumber: string): Promise<boolean> {
    return this.companyRepository.VatNumberExists(registerNumber);
  }

  async companyIdExists(id: Types.ObjectId): Promise<boolean> {
    return this.companyRepository.idExists(id);
  }

  findAllCompanies() {
    return this.companyRepository.findAll();
  }

  async getCompanyById(
    identifier: string | Types.ObjectId,
  ): Promise<FlattenMaps<Company> & { _id: Types.ObjectId }> {
    const result: FlattenMaps<Company> & { _id: Types.ObjectId } =
      await this.companyRepository.findById(identifier);

    if (result == null) {
      throw new NotFoundException('Company not found');
    }

    return result;
  }

  async getByEmailOrName(identifier: string) {
    const result = await this.companyRepository.findByEmailOrName(identifier);

    if (result == null) {
      throw new NotFoundException('Client not found');
    }
    console.log(result);
    return result;
  }

  async employeeIsInCompany(compId: Types.ObjectId, empId: Types.ObjectId) {
    return await this.companyRepository.employeeExists(compId, empId);
  }

  async getCompanyByRegNumber(
    registrationNumber: string,
  ): Promise<FlattenMaps<Company> & { _id: Types.ObjectId }> {
    const result =
      await this.companyRepository.findByRegistrationNumber(registrationNumber);

    if (result == null) {
      throw new NotFoundException('Company not found');
    }

    return result;
  }

  //TODO:Add authorization for endpoint
  //For now, I assume the person is authorised
  async addEmployee(addUserDto: AddUserToCompanyDto) {
    //Add validation
    const inputValidated = await this.addUserValidation(addUserDto); //TODO: Add more validation later
    if (!inputValidated.isValid) {
      throw new NotFoundException(inputValidated.message);
    }

    const companyName = (await this.getCompanyById(addUserDto.currentCompany))
      .name;

    const user = await this.usersService.getUserByUsername(
      addUserDto.newUserUsername,
    );
    //CreateEmployee and link them to the company
    const newEmployeeId = (
      await this.employeeService.create({
        companyId: addUserDto.currentCompany,
        userId: user._id,
      })
    )._id;

    const joinedCompany: JoinedCompany = {
      companyId: addUserDto.currentCompany,
      employeeId: newEmployeeId,
      companyName: companyName,
    };
    user.joinedCompanies.push(joinedCompany);

    const updatedUser = await this.usersService.updateUser(user._id, user);
    console.log(updatedUser);
    return joinedCompany;
  }

  async update(id: Types.ObjectId, updateCompanyDto: UpdateCompanyDto) {
    const inputValidated = await this.companyUpdateIsValid(updateCompanyDto);
    if (!inputValidated.isValid) {
      throw new NotFoundException(inputValidated.message);
    }

    const updatedCompany = await this.companyRepository.update(
      id,
      updateCompanyDto,
    );
    console.log(updatedCompany);
    return updatedCompany;
  }

  async deleteCompany(id: string): Promise<boolean> {
    await this.companyRepository.delete(id);
    return true;
  }

  async addUserValidation(addUserToCompanyDto: AddUserToCompanyDto) {
    if (addUserToCompanyDto.currentCompany) {
      const idExists = this.companyIdExists(addUserToCompanyDto.currentCompany);
      if (!idExists) {
        return new ValidationResult(false, 'Company not found');
      }
    }

    if (addUserToCompanyDto.adminId) {
      const isAllowedToAssign = this.employeeIsInCompany(
        addUserToCompanyDto.currentCompany,
        addUserToCompanyDto.currentCompany,
      );
      if (!isAllowedToAssign) {
        return new ValidationResult(false, 'User not allowed to assign');
      }
    }

    if (addUserToCompanyDto.newUserUsername) {
      const usernameExists = this.usersService.usernameExists(
        addUserToCompanyDto.newUserUsername,
      );
      if (!usernameExists) {
        return new ValidationResult(false, 'Username not found');
      }

      const userJoinedCompanies = (
        await this.usersService.getUserByUsername(
          addUserToCompanyDto.newUserUsername,
        )
      ).joinedCompanies;

      for (const userJoinedCompany of userJoinedCompanies) {
        if (userJoinedCompany.companyId == addUserToCompanyDto.currentCompany) {
          return new ValidationResult(false, 'User already in Company');
        }
      }
    }

    return new ValidationResult(true);
  }

  async companyIsValid(company: Company) {
    if (!company) return new ValidationResult(false, `Company is null`);

    if (company.inventoryItems) {
      for (const item of company.inventoryItems) {
        //TODO: When inventory is done//

        /* const exists = await this.InventoryService.employeeExists(item);
        if (!exists)
          return new ValidationResult(
            false,
            `Invalid Inventory ID: ${item}`,
          );*/
        if (!Types.ObjectId.isValid(item)) {
          return new ValidationResult(false, 'Invalid ObjectId in Inventory');
        }
      }
    }
    if (company.employees) {
      for (const employee of company.employees) {
        if (!Types.ObjectId.isValid(employee))
          return new ValidationResult(false, 'Employee ID is invalid');

        if (!(await this.employeeService.employeeExists(employee))) {
          return new ValidationResult(
            false,
            'Employee ID Not Found in Company',
          );
        }
      }
    }

    return new ValidationResult(true);
  }

  async companyCreateIsValid(company: CreateCompanyDto) {
    if (!company) return new ValidationResult(false, `Company is null`);

    if (!this.usersService.userIdExists(company.userId)) {
      return new ValidationResult(false, `User not found`);
    }

    if (await this.companyVatNumberExists(company.vatNumber)) {
      return new ValidationResult(
        false,
        `Company with ${company.vatNumber} already exists`,
      );
    }

    if (await this.companyRegNumberExists(company.registrationNumber)) {
      return new ValidationResult(
        false,
        `Company with ${company.registrationNumber} already exists`,
      );
    }

    if (company.inventoryItems) {
      for (const item of company.inventoryItems) {
        //TODO: When inventory is done//

        /* const exists = await this.InventoryService.employeeExists(item);
        if (!exists)
          return new ValidationResult(
            false,
            `Invalid Inventory ID: ${item}`,
          );*/
        if (!Types.ObjectId.isValid(item)) {
          return new ValidationResult(false, 'Invalid ObjectId in Inventory');
        }
      }
    }

    if (company.employees) {
      for (const employee of company.employees) {
        if (!Types.ObjectId.isValid(employee))
          return new ValidationResult(false, 'Employee ID is invalid');

        if (!(await this.employeeService.employeeExists(employee))) {
          return new ValidationResult(
            false,
            'Employee ID Not Found in Company',
          );
        }
      }
    }
    return new ValidationResult(true);
  }

  async companyUpdateIsValid(company: UpdateCompanyDto) {
    if (!company) return new ValidationResult(false, `Company is null`);

    if (!(await this.companyRegNumberExists(company.registrationNumber))) {
      return new ValidationResult(
        false,
        `Company with ${company.registrationNumber} does not exist`,
      );
    }

    if (company.inventoryItems) {
      for (const item of company.inventoryItems) {
        //TODO: When inventory is done//

        /* const exists = await this.InventoryService.employeeExists(item);
        if (!exists)
          return new ValidationResult(
            false,
            `Invalid Inventory ID: ${item}`,
          );*/
        if (!Types.ObjectId.isValid(item)) {
          return new ValidationResult(false, 'Invalid ObjectId in Inventory');
        }
      }
    }
    if (company.employees) {
      for (const employee of company.employees) {
        if (!Types.ObjectId.isValid(employee))
          return new ValidationResult(false, 'Employee ID is invalid');

        if (!(await this.employeeService.employeeExists(employee))) {
          return new ValidationResult(
            false,
            'Employee ID Not Found in Company',
          );
        }
      }
    }

    return new ValidationResult(true);
  }

  async getAllEmployees(companyId: Types.ObjectId) {
    try {
      return this.employeeService.findAllInCompany(companyId);
    } catch (e) {
      throw e;
    }
  }
}
