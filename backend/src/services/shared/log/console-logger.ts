import type { ILogger } from './logger.interface.js';

export class ConsoleLogger implements ILogger {
  private formatMetadata(metadata?: Record<string, any>): string {
    if (!metadata || Object.keys(metadata).length === 0) {
      return '';
    }

    const formatted = Object.entries(metadata)
      .map(([key, value]) => {
        const displayValue = typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
        return `${key}=${displayValue}`;
      })
      .join(' ');

    return ` [${formatted}]`;
  }

  info(msg: string, metadata?: Record<string, any>): void {
    const meta = this.formatMetadata(metadata);
    console.log(`ℹ️  ${msg}${meta}`);
  }

  warning(msg: string, metadata?: Record<string, any>): void {
    const meta = this.formatMetadata(metadata);
    console.warn(`⚠️  ${msg}${meta}`);
  }

  error(msg: string, metadata?: Record<string, any>): void {
    const meta = this.formatMetadata(metadata);
    console.error(`❌ ${msg}${meta}`);
  }

  debug(msg: string, metadata?: Record<string, any>): void {
    const meta = this.formatMetadata(metadata);
    console.debug(`🐛 ${msg}${meta}`);
  }
}
