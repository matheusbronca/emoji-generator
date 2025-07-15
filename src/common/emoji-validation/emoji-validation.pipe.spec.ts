import { BadRequestException } from '@nestjs/common';
import { EmojiValidationPipe } from './emoji-validation.pipe';

describe('EmojiValidationPipe', () => {
  const emojiPipe = new EmojiValidationPipe();

  it('should be defined', () => {
    expect(emojiPipe).toBeDefined();
  });

  it('should return undefined if no value is passed as in', () => {
    const result = emojiPipe.transform(undefined);
    expect(result).toBeUndefined();
  });

  it('should throw a Bad Request Error if the value is not a number ', () => {
    const result = () =>
      emojiPipe.transform('definitely not a number' as unknown as number);
    expect(result).toThrow(BadRequestException);
  });

  it('should throw a Bad Request Error if the value is less than zero', () => {
    const result = () => emojiPipe.transform(-1);
    expect(result).toThrow(BadRequestException);
  });

  it('should throw a Bad Request Error if the value is greater than 10', () => {
    const result = () => emojiPipe.transform(11);
    expect(result).toThrow(BadRequestException);
  });

  it('should return the respective string as a number', () => {
    const result = emojiPipe.transform('5' as unknown as number);
    expect(result).toEqual(5);
  });
});
