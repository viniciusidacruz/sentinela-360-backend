import { Injectable, Logger } from '@nestjs/common';
import { AuditPort, AuditEvent } from '../../application/ports/audit.port';

@Injectable()
export class AuditNoopService implements AuditPort {
  private readonly logger = new Logger(AuditNoopService.name);

  async log(event: AuditEvent): Promise<void> {
    this.logger.log(`[AUDIT] ${JSON.stringify(event)}`);
  }
}
