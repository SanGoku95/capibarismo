import type OpenAI from 'openai';
import type { ILogger } from './log/logger.interface.js';

export class TextToJsonService {
  constructor(
    private openai: OpenAI,
    private logger: ILogger
  ) {}

  async convert<T = any>(
    text: string,
    schema: any,
    _schemaName: string,
    systemPrompt?: string
  ): Promise<T> {
    const fullSystemPrompt = this.buildSystemPrompt(schema, systemPrompt);
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: fullSystemPrompt
        },
        {
          role: 'user',
          content: `Extract structured data from this text:\n\n${text}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const extractedData = completion.choices[0].message.content;
    if (!extractedData) {
      throw new Error('No data extracted from OpenAI');
    }

    return this.parseResponse<T>(extractedData);
  }

  private buildSystemPrompt(schema: any, customPrompt?: string): string {
    const defaultPrompt = `You are an expert at extracting structured data from text.
Extract all available information from the provided text and format it according to the JSON schema.
Be precise with numbers and ensure all required fields are filled.`;

    return `${customPrompt || defaultPrompt}

**CRITICAL**: You MUST respond with ONLY valid JSON that matches this exact schema. Do not include any markdown formatting, code blocks, or explanatory text.

JSON Schema to follow:
${JSON.stringify(schema, null, 2)}`;
  }

  private parseResponse<T>(extractedData: string): T {
    try {
      return JSON.parse(extractedData) as T;
    } catch (error) {
      this.logger.error('failed to parse openai response', {
        error: error instanceof Error ? error.message : 'unknown error',
        preview: extractedData.substring(0, 200)
      });
      throw new Error(`Invalid JSON returned from OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
