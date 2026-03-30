export interface Survey<T = any> {
  id: string;
  source: string;
  sourceUrl: string;
  content: string;
  data: T;
  createdAt: Date;
  updatedAt: Date;
}

export interface PDFExtract {
  id: string;
  sourceUrl: string;
  content: string;
  createdAt: Date;
}
