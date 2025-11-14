import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ID!');
    }
    return value; // return the value if valid
  }
}