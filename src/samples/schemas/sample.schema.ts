import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Document } from "mongoose";
import {
  Attachment,
  AttachmentSchema,
} from "src/attachments/schemas/attachment.schema";
import { OwnableClass } from "src/common/schemas/ownable.schema";
import {
  DatasetClass,
  DatasetSchema,
} from "src/datasets/schemas/dataset.schema";
import { v4 as uuidv4 } from "uuid";

export type SampleDocument = Sample & Document;

@Schema({
  collection: "Sample",
  toJSON: {
    getters: true,
  },
  timestamps: true,
})
export class Sample extends OwnableClass {
  @Prop({ type: String })
  _id: string;

  @ApiProperty({
    type: String,
    default: () => uuidv4(),
  })
  @Prop({ type: String, unique: true, required: true, default: () => uuidv4() })
  sampleId: string;

  @ApiProperty({
    type: String,
    required: false,
    description: "The owner of the sample",
  })
  @Prop({ type: String, required: false })
  owner: string;

  @ApiProperty({
    type: String,
    required: true,
    description: "A description of the sample",
  })
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({
    type: Object,
    default: {},
    description: "JSON object containing the sample characteristics metadata",
  })
  @Prop({ type: Object, default: {} })
  sampleCharacteristics: Record<string, unknown>;

  @ApiProperty({
    type: Boolean,
    default: false,
    description: "Flag is true when data are made publically available",
  })
  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  /*
  @ApiProperty({ type: "array", items: { $ref: getSchemaPath(Attachment) } })
  @Prop([AttachmentSchema])*/
  // this property should not be present in the database model
  attachments: Attachment[];

  /*
  @ApiProperty({ type: "array", items: { $ref: getSchemaPath(Dataset) } })
  @Prop([DatasetSchema])*/
  // this property should not be present in the database model
  datasets: DatasetClass[];
}

export const SampleSchema = SchemaFactory.createForClass(Sample);

SampleSchema.index({ "$**": "text" });
