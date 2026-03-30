export interface ILogger {
  info(msg: string, metadata?: Record<string, any>): void;
  warning(msg: string, metadata?: Record<string, any>): void;
  error(msg: string, metadata?: Record<string, any>): void;
  debug(msg: string, metadata?: Record<string, any>): void;
}
