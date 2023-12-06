import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
// Function to filter properties based on a DTO
export const filterProperties = (obj: any, dtoClass: any): any => {
  const instance = plainToClass(dtoClass, obj);
  const errors = validateSync(instance);

  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }

  return Object.keys(instance).reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {});
};
