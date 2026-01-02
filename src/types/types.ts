export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
  lang: string;
}

export interface TranscriptResponse {
  content: TranscriptSegment[];
}

export interface TranscriptTextResponse {
  content: string;
  lang: string;
  availableLangs: string[];
}

export type Language = 'en' | 'zh-CN' | 'fr' | 'es' | 'ja' | 'de' | 'ko' | 'pt' | 'it' | 'ru' | 'ar';
