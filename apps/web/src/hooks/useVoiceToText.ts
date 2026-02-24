import { ref } from "vue";

export interface Options {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

let instance: SpeechRecognition | null = null;

const getInstance = (options: Options): SpeechRecognition => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!instance) {
    instance = new SpeechRecognition();
    const {
      lang = "zh-CN",
      continuous = false,
      interimResults = false,
      maxAlternatives = 1,
    } = options;
    instance.lang = lang;
    instance.continuous = continuous;
    instance.interimResults = interimResults;
    instance.maxAlternatives = maxAlternatives;
  }
  return instance;
};

export function useVoiceToText(options: Options) {
  const recognition = getInstance(options);
  const isRecording = ref(false);
  // 开始识别
  const start = (callback?: (transcript: string) => void) => {
    isRecording.value = true;
    recognition.start();
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results?.[i]?.[0]?.transcript;
        finalTranscript += transcript;
      }
      callback?.(finalTranscript);
    };
  };
  // 停止识别
  const stop = () => {
    recognition.stop();
    isRecording.value = false;
  };
  return {
    isRecording,
    start,
    stop,
  };
}
