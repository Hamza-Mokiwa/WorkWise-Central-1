import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { CompanyService } from '../company/company.service';
import { JobService } from '../job/job.service';
import { ClientService } from '../client/client.service';
import { TeamService } from '../team/team.service';
import { InvoiceService } from '../invoices/invoice.service';
import { InventoryService } from '../inventory/inventory.service';
import { Types } from 'mongoose';
import {
  ClientStatsResponseDto,
  EmployeeStatsResponseDto,
  InventoryStatsResponseDto,
  InvoiceStatsResponseDto,
  Job,
  JobsStatsResponseDto,
  teamRating,
  TeamStatsResponseDto,
} from './dto/stats-response.dto';
import { StockMovementsService } from '../stockmovements/stockmovements.service';

@Injectable()
export class StatsService {
  constructor(
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
    @Inject(forwardRef(() => JobService))
    private jobService: JobService,
    @Inject(forwardRef(() => TeamService))
    private teamService: TeamService,
    @Inject(forwardRef(() => InvoiceService))
    private invoiceService: InvoiceService,
    @Inject(forwardRef(() => InventoryService))
    private inventoryService: InventoryService,
    @Inject(forwardRef(() => StockMovementsService))
    private stockMovementsService: StockMovementsService,
  ) {}

  async clientStats(clientId: Types.ObjectId) {
    const client = await this.clientService.getClientByIdInternal(clientId);
    const jobs = await this.jobService.findAllJobsForClient(clientId);
    const statuses = await this.jobService.findAllStatusesInCompanyInternal(client.details.companyId);
    const lastStatus = statuses[statuses.length - 1].status;
    const invoices = await this.invoiceService.findAllForClient(clientId);

    const result = new ClientStatsResponseDto();
    result.clientId = clientId;
    result.numTotalJobs = jobs.length;
    result.numActiveJobs = 0;
    let numJobRating = 0;
    let numbServiceRating = 0;
    result.workPerformanceRatingAverage = 0;
    result.customerServiceRatingAverage = 0;
    result.numActiveJobs = 0;
    result.numCompletedJobs = 0;

    for (const job of jobs) {
      const status = await this.jobService.getStatusByIdWithoutValidation(job.status);
      if (status.status !== lastStatus) {
        result.numActiveJobs++;
        result.activeJobs.push({
          jobId: job._id,
          jobTitle: job.details.heading,
        });
      } else {
        result.numCompletedJobs++;
        result.completedJobs.push({
          jobId: job._id,
          jobTitle: job.details.heading,
        });
      }

      result.allJobs.push({
        jobId: job._id,
        jobTitle: job.details.heading,
      });

      if (job.clientFeedback.jobRating) {
        result.workPerformanceRatingAverage += job.clientFeedback.jobRating;
        numJobRating++;
        result.workPerformanceRating.push({
          jobId: job._id,
          jobTitle: job.details.heading,
          rating: job.clientFeedback.jobRating,
        });
      }

      if (job.clientFeedback.customerServiceRating) {
        result.customerServiceRatingAverage += job.clientFeedback.customerServiceRating;
        numbServiceRating++;
        result.customerServiceRating.push({
          jobId: job._id,
          jobTitle: job.details.heading,
          rating: job.clientFeedback.customerServiceRating,
        });
      }
    }
    result.workPerformanceRatingAverage = result.workPerformanceRatingAverage / numJobRating;
    result.customerServiceRatingAverage = result.customerServiceRatingAverage / numbServiceRating;

    for (const invoice of invoices) {
      if (invoice.paid) {
        result.numInvoicesPaid += invoice.total;
        result.invoicesPaid.push({
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber.toString(),
          total: invoice.total,
          job: {
            jobId: invoice.jobId,
            jobTitle: jobs.find((job) => job._id === invoice.jobId).details.heading,
          },
        });
      } else {
        result.numInvoicesUnpaid += invoice.total;
        result.invoicesUnpaid.push({
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber.toString(),
          total: invoice.total,
          job: {
            jobId: invoice.jobId,
            jobTitle: jobs.find((job) => job._id === invoice.jobId).details.heading,
          },
        });
      }
    }
    return result;
  }

  async getTotalClients(companyId: Types.ObjectId) {
    const clients = await this.clientService.getAllClientsInCompanyInternal(companyId);
    return clients.length;
  }

  async employeeStats(employeeId: Types.ObjectId) {
    const employee = await this.employeeService.findById(employeeId);
    const jobs = await this.jobService.findAllJobsForEmployee(employeeId);
    const statuses = await this.jobService.findAllStatusesInCompanyInternal(employee.companyId);
    const lastStatus = statuses[statuses.length - 1].status;
    const result = new EmployeeStatsResponseDto();
    result.employeeId = employeeId;
    let numJobRating = 0;
    let numbServiceRating = 0;
    result.numActiveJobs = 0;
    result.numCompletedJobs = 0;
    result.numTotalJobs = 0;
    result.workPerformanceRatingAverage = 0;
    result.customerServiceRatingAverage = 0;

    for (const job of jobs) {
      const status = await this.jobService.getStatusByIdWithoutValidation(job.status);
      if (status.status !== lastStatus) {
        result.numActiveJobs++;
        result.activeJobs.push({
          jobId: job._id,
          jobTitle: job.details.heading,
        });
      } else {
        result.numCompletedJobs++;
        result.completedJobs.push({
          jobId: job._id,
          jobTitle: job.details.heading,
        });
      }

      result.numTotalJobs++;
      result.totalJobs.push({
        jobId: job._id,
        jobTitle: job.details.heading,
      });

      if (job.clientFeedback.jobRating) {
        result.workPerformanceRatingAverage += job.clientFeedback.jobRating;
        numJobRating++;
        result.workPerformanceRating.push({
          jobId: job._id,
          jobTitle: job.details.heading,
          rating: job.clientFeedback.jobRating,
        });
      }

      if (job.clientFeedback.customerServiceRating) {
        result.customerServiceRatingAverage += job.clientFeedback.customerServiceRating;
        numbServiceRating++;
        result.customerServiceRating.push({
          jobId: job._id,
          jobTitle: job.details.heading,
          rating: job.clientFeedback.customerServiceRating,
        });
      }
    }
    result.workPerformanceRatingAverage = result.workPerformanceRatingAverage / numJobRating;
    result.customerServiceRatingAverage = result.customerServiceRatingAverage / numbServiceRating;

    return result;
  }

  async getTotalEmployees(companyId: Types.ObjectId) {
    const employees = await this.employeeService.findAllInCompany(companyId);
    return employees.length;
  }

  async jobStats(companyId: Types.ObjectId) {
    const jobs = await this.jobService.getAllJobsInCompanyWithoutValidation(companyId);
    const invoices = await this.invoiceService.findAllForJob(companyId);
    const result = new JobsStatsResponseDto();
    result.totalNumJobs = jobs.length;
    let numJobRating = 0;
    let numbServiceRating = 0;
    result.numActiveJobs = 0;
    result.numCompletedJobs = 0;
    result.numArchivedJobs = 0;
    result.workPerformanceRatingAverage = 0;
    result.customerServiceRatingAverage = 0;

    for (const job of jobs) {
      const status = await this.jobService.getStatusByIdWithoutValidation(job.status);
      const statuses = await this.jobService.findAllStatusesInCompanyInternal(job.companyId);
      const lastStatus = statuses[statuses.length - 1].status;
      if (status.status === 'Archive') {
        result.numArchivedJobs++;
        result.archivedJobs.push({
          jobId: job._id,
          jobTitle: job.details.heading,
        });
      } else if (status.status === lastStatus) {
        result.numCompletedJobs++;
        result.completedJobs.push({
          jobId: job._id,
          jobTitle: job.details.heading,
        });
      } else {
        result.numActiveJobs++;
        result.activeJobs.push({
          jobId: job._id,
          jobTitle: job.details.heading,
        });
      }

      if (job.clientFeedback.jobRating) {
        result.workPerformanceRatingAverage += job.clientFeedback.jobRating;
        numJobRating++;
        result.workPerformanceRating.push({
          jobId: job._id,
          jobTitle: job.details.heading,
          rating: job.clientFeedback.jobRating,
        });
      }

      if (job.clientFeedback.customerServiceRating) {
        result.customerServiceRatingAverage += job.clientFeedback.customerServiceRating;
        numbServiceRating++;
        result.customerServiceRating.push({
          jobId: job._id,
          jobTitle: job.details.heading,
          rating: job.clientFeedback.customerServiceRating,
        });
      }
    }
    result.workPerformanceRatingAverage = result.workPerformanceRatingAverage / numJobRating;
    result.customerServiceRatingAverage = result.customerServiceRatingAverage / numbServiceRating;
    result.numJobsUnpaidInvoice = 0;
    result.amountOutstanding = 0;
    for (const invoice of invoices) {
      if (!invoice.paid) {
        result.numJobsUnpaidInvoice++;
        result.jobsUnpaidInvoice.push({
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber.toString(),
          total: invoice.total,
          job: {
            jobId: invoice.jobId,
            jobTitle: jobs.find((job) => job._id === invoice.jobId).details.heading,
          },
        });
        result.amountOutstanding += invoice.total;
      }
    }
    return result;
  }

  async inventoryStats(companyId: Types.ObjectId) {
    const inventoryItems = await this.inventoryService.findAllInCompany(companyId);
    const stockMovements = await this.stockMovementsService.findAllInCompany(companyId);
    const listOfUse = [];

    const result = new InventoryStatsResponseDto();
    result.totalNumItems = inventoryItems.length;

    for (const item of inventoryItems) {
      if (item.reorderLevel >= item.currentStockLevel) {
        result.itemsToReorder.push({
          inventoryId: item._id,
          itemName: item.name,
          quantity: item.currentStockLevel,
        });
      }
      listOfUse.push({ id: item._id, usage: await this.stockMovementsService.getUsageForInventoryItem(item._id) });
    }
    // Finding the highest used items
    result.highestUsedItems = listOfUse.reduce((max, item) => (item.usage > max.usage ? item : max)).id;
    result.costDueToStockLoss = 0;

    for (const stockTake of stockMovements) {
      for (const item of (stockTake as any).items) {
        if (item.recordedStockLevel - item.currentStockLevel < 0) {
          result.costDueToStockLoss += (item.recordedStockLevel - item.currentStockLevel) * item.inventoryItem.cost;
          result.stockLost.push({
            inventoryItem: {
              inventoryId: item.inventoryItem.inventoryId,
              itemName: item.inventoryItem.name,
            },
            stockTakeId: stockTake._id,
          });
        }
      }
    }
    return result;
  }

  async teamStats(companyId: Types.ObjectId) {
    const teams = await this.teamService.findAllInCompany(companyId);

    const result = new TeamStatsResponseDto();
    result.totalNumTeams = teams.length;
    result.averageNumMembers = 0;
    result.averageNumJobsForTeam = 0;
    let totalTeam = 0;

    for (const team of teams) {
      result.averageNumMembers += team.teamMembers.length;
      totalTeam++;
      result.averageNumJobsForTeam += team.currentJobAssignments.length;

      const rating = new teamRating();
      rating.teamId = team._id;
      let numJobRating = 0;
      let numbServiceRating = 0;
      for (const jobId of team.currentJobAssignments) {
        const job = await this.jobService.getJobById(jobId);
        if (job && job.clientFeedback && job.clientFeedback.jobRating) {
          rating.workPerformanceRatingAverage += job.clientFeedback.jobRating;
          numJobRating++;
          rating.workPerformanceRating.push({
            jobId: job._id,
            jobTitle: job.details.heading,
            rating: job.clientFeedback.jobRating,
          });
        }

        if (job.clientFeedback.customerServiceRating) {
          rating.customerServiceRatingAverage += job.clientFeedback.customerServiceRating;
          numbServiceRating++;
          rating.customerServiceRating.push({
            jobId: job._id,
            jobTitle: job.details.heading,
            rating: job.clientFeedback.customerServiceRating,
          });
        }
      }
      rating.workPerformanceRatingAverage = rating.workPerformanceRatingAverage / numJobRating;
      rating.customerServiceRatingAverage = rating.customerServiceRatingAverage / numbServiceRating;
      result.ratingPerTeam.push(rating);
    }
    result.averageNumMembers = result.averageNumMembers / totalTeam;
    result.averageNumJobsForTeam = result.averageNumJobsForTeam / totalTeam;
    return result;
  }

  async invoiceStats(companyId: Types.ObjectId) {
    const invoices = await this.invoiceService.detailedFindAllInCompany(companyId);

    const result = new InvoiceStatsResponseDto();
    result.totalNumInvoices = invoices.length;
    result.numPaid = 0;
    result.numUnpaid = 0;

    for (const invoice of invoices) {
      if (invoice.paid) {
        result.numPaid++;
        result.paidInvoices.push({
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber.toString(),
          total: invoice.total,
          job: {
            jobId: invoice.jobId._id,
            jobTitle: (invoice.jobId as any).details.heading,
          },
        });

        result.revenue += invoice.total;
      } else {
        result.numUnpaid++;
        result.unpaidInvoices.push({
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber.toString(),
          total: invoice.total,
          job: {
            jobId: invoice.jobId._id,
            jobTitle: (invoice.jobId as any).details.heading,
          },
        });
      }
    }
    return result;
  }
}
