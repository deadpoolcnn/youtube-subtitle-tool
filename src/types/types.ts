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

export interface SubtitleRecord {
  id: number;
  user_email: string;
  title: string;
  content: string;
  created_at: string; // YYYY-MM-DD format
}

export interface SaveSubtitleRequest {
  email: string;
  title: string;
  content: string;
}

export interface QuotaInfo {
  hasApiKey: boolean;
  hasQuota: boolean;
  used: number;
  limit: number;
  remaining: number;
}

export interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  quotaInfo?: {
    used: number;
    limit: number;
    remaining: number;
  };
}
