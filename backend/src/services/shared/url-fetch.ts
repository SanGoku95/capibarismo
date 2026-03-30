import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { ILogger } from './log/logger.interface.js';

export class URLFetchService {
  constructor(private logger: ILogger) {}

  async downloadPDF(url: string, outputDir: string): Promise<string> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`failed to download PDF: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('pdf')) {
      this.logger.warning('downloaded file may not be a PDF', { contentType });
    }

    const buffer = await response.arrayBuffer();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `downloaded-${timestamp}.pdf`;
    const filepath = join(outputDir, filename);

    await mkdir(outputDir, { recursive: true });
    await writeFile(filepath, Buffer.from(buffer));

    this.logger.info('pdf downloaded', { url, filepath, size: buffer.byteLength });

    return filepath;
  }
}
