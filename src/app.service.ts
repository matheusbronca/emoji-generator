import { Injectable } from '@nestjs/common';

export const EMOJIS = [
  '😀',
  '🎉',
  '🔥',
  '💡',
  '🌈',
  '📚',
  '🚀',
  '🍕',
  '🎧',
  '🧠',
];

@Injectable()
export class AppService {
  getEmoji(index?: number): string {
    const emojis = this.getEmojis();
    if (index !== undefined && index >= 0 && index < emojis.length) {
      return emojis[index];
    }
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
  }

  getEmojis() {
    return EMOJIS;
  }
}
