import { BadRequestException } from "@nestjs/common";
import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class ValidationParams implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata){
    if(!value) throw new BadRequestException(`The value is required ${metadata.data}`)    

    return value
  }
}