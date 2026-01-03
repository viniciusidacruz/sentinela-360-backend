import { Injectable } from '@nestjs/common';
import { AuditPort, AuditEvent } from '../../application/ports/audit.port';

@Injectable()
export class AuditNoopService implements AuditPort {
  async log(event: AuditEvent): Promise<void> {
    console.log('[AUDIT]', JSON.stringify(event));
  }
}
