import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateJobDto } from '../dto/create-job.dto';

export class address {
  @ApiProperty()
  @Prop({ type: String, required: true })
  street: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  suburb: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  city: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  postalCode: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  complex: string;
  @ApiProperty()
  @Prop({ type: String, required: true })
  houseNumber: string;
}

export class clientFeedback {
  @ApiProperty()
  @Prop({ required: false, default: 10 })
  jobRating: number;

  @ApiProperty()
  @Prop({ required: false, default: 10 })
  customerServiceRating: number;

  @ApiProperty()
  @Prop({ required: false, default: 10 })
  comments: string;
}

export class details {
  @ApiProperty()
  @Prop({ required: true })
  heading: string;

  @ApiProperty()
  @Prop({ required: true })
  description: string;

  @ApiProperty()
  @Prop({ required: true })
  notes: string;

  @ApiProperty()
  @Prop({ required: true })
  address: address;
}

@Schema()
export class Job {
  constructor(createJobDto: CreateJobDto) {
    this.clientId = new Types.ObjectId(createJobDto.clientId); //It must be validated in jobController
    this.assignedBy = new Types.ObjectId(createJobDto.assignedBy);
    this.scheduledDateTime = createJobDto.scheduledDateTime;
    this.status = createJobDto.status;
    if (createJobDto.inventoryUsed.length > 0)
      this.inventoryUsed = createJobDto.inventoryUsed.map(
        (item) => new Types.ObjectId(item),
      );
    this.details = {
      heading: createJobDto.details.heading,
      description: createJobDto.details.description,
      notes: createJobDto.details.notes,
      address: createJobDto.details.address,
    };

    this.imagesTaken = createJobDto.imagesTaken;
    this.created_at = new Date();
  }

  @ApiProperty()
  @Prop({ required: true })
  clientId: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId, required: true })
  assignedBy: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], required: true })
  assignedEmployees: Types.ObjectId[];

  @ApiProperty()
  @Prop({ required: true })
  scheduledDateTime: Date;

  @ApiProperty()
  @Prop({ required: true })
  status: string;

  @ApiProperty()
  @Prop({ type: [Types.ObjectId], required: true, default: [] })
  inventoryUsed: Types.ObjectId[];

  @ApiProperty()
  @Prop({ required: true })
  details: details;

  @ApiProperty()
  @Prop({ type: [String], required: true })
  imagesTaken: string[];

  @ApiProperty()
  @Prop({ required: false })
  clientFeedback: clientFeedback;

  @ApiProperty()
  @Prop({ required: false, default: new Date() })
  public created_at: Date;

  @ApiProperty()
  @Prop({ required: false })
  public updated_at: Date;

  @ApiProperty()
  @Prop({ required: false })
  public deleted_at: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
