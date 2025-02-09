import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import { join } from 'path';

@Injectable()
export class LoggingService {
  private readonly logDir = join(process.cwd(), 'logs');
  private loggers: Map<string, Logger> = new Map();

  constructor() {
    // Ensure logs directory exists
    const fs = require('fs');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getLogger(module: string): Logger {
    if (!this.loggers.has(module)) {
      this.loggers.set(
        module,
        createLogger({
          format: format.combine(
            format.timestamp(),
            format.json()
          ),
          transports: [
            new transports.File({
              filename: join(this.logDir, `${module}.log`),
              level: 'info',
            }),
            new transports.File({
              filename: join(this.logDir, `${module}-error.log`),
              level: 'error',
            }),
          ],
        })
      );
    }
    return this.loggers.get(module);
  }
}
