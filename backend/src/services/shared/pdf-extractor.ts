import { readFileSync } from 'fs';
import type { Mistral } from '@mistralai/mistralai';
import type { ILogger } from './log/logger.interface.js';

export class PDFExtractorService {
  constructor(
    private client: Mistral,
    private logger: ILogger
  ) {}

  async extractText(pdfPath: string): Promise<string> {
    const fileBuffer = readFileSync(pdfPath);

    const resp = await this.client.files.upload({
      purpose: "ocr",
      file: {
        fileName: pdfPath.split('/').pop() || 'document.pdf',
        content: fileBuffer,
      },
    })

    const ocrResponse = await this.client.ocr.process({
      model: 'mistral-ocr-latest',
      document: {
        type: "file",
        fileId: resp.id,
      },
      tableFormat: 'html',
      includeImageBase64: true
    } );

    let extractedText = ocrResponse.pages?.map((page) => page.markdown + page.tables?.map(
      (table) => table.content
    ).join("\n")).join("\n");

    this.logger.info('text extracted', {
      characters: extractedText.length,
      pages: ocrResponse.pages?.length || 0
    });

    if (!extractedText || extractedText.length < 100) {
      this.logger.warning('insufficient text extracted', {
        characters: extractedText.length
      });
    }

    return extractedText;
  }
}
