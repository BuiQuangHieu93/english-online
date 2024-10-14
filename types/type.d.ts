// Define the interface for each vocabulary item
export interface VocabularyItem {
  english: string;
  ipa: string;
  vietnamese: string;
  sentence: string;
}

export interface VocabularyItemReturn {
  english: string;
  ipa: string;
  vietnamese: string;
  sentence: string;
  sentence_to_ipa: string;
}

export interface VocabularyItemReturnList {
  vocabulary: VocabularyItemReturn[];
}
// Define the interface for each topic
export interface Topic {
  topic: string;
  vocabulary: VocabularyItem[];
}

// Define the interface for the vocabularies list
//   type VocabulariesList = Topic[];

// globals.d.ts

interface SpeechRecognition extends EventTarget {
  new (): SpeechRecognition;
  readonly interimResults: boolean;
  readonly lang: string;
  readonly maxAlternatives: number;
  readonly onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  readonly onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};
