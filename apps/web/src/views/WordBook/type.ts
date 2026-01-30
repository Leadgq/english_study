import type { Word } from '@en/common/word';
export type WordWithIsPlaying = Word & {
  isPlaying: boolean;
}