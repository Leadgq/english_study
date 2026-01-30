import type { WordWithIsPlaying } from "@/views/WordBook/type";
import { ref } from "vue";

let instance: SpeechSynthesisUtterance | null = null;
interface Options {
  rate?: number;
  volume?: number;
  pitch?: number;
  lang?: string;
}

function getInstance(options: Options) {
  if (!instance) {
    instance = new SpeechSynthesisUtterance();
    const { rate = 0.7, volume = 1, pitch = 1, lang = "en-Us" } = options;
    instance.rate = rate;
    instance.volume = volume;
    instance.pitch = pitch;
    instance.lang = lang;
  }
  return instance;
}

export const useAudio = (options: Options) => {
  const pronounce = getInstance(options);
  const isSpeaking = ref(false);
  const playAudio = (item: WordWithIsPlaying) => {
    if (item.isPlaying || isSpeaking.value) {
      return;
    }
    pronounce.text = item.word;
    item.isPlaying = true;
    isSpeaking.value = true;
    window.speechSynthesis.speak(pronounce);
    pronounce.onend = () => {
      item.isPlaying = false;
      isSpeaking.value = false;
    };
  };
  return {
    playAudio,
  };
};
