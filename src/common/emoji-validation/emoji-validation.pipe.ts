import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmojiValidationPipe implements PipeTransform {
  transform(value: number | undefined) {
    if (value === undefined) return;
    if (isNaN(value))
      throw new BadRequestException(
        `Validation failed: ${value} is not a number.`,
      );
    if (value < 0 || value > 10)
      throw new BadRequestException(
        `Validation failed: ${value} is not between 0 and 10.`,
      );

    console.log('Pipe: Validation passed!');
    return parseInt(value as unknown as string);
  }
}
