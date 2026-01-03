export enum AuditEventType {
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_REFRESH = 'AUTH_REFRESH',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
}

export interface AuditEvent {
  type: AuditEventType;
  userId?: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditPort {
  log(event: AuditEvent): Promise<void>;
}
