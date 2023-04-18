import * as _ApprovalInterceptor from './approval.interceptor';
import * as _ErrorInterceptor from './error.interceptor';
import * as _LoadingInterceptor from './loading.interceptor';
import * as _NotificationInterceptor from './notification.interceptor';

export const Interceptors = {
  Approval: _ApprovalInterceptor.ApprovalInterceptor,
  Error: _ErrorInterceptor.ErrorInterceptor,
  Loading: _LoadingInterceptor.LoadingInterceptor,
  Notification: _NotificationInterceptor.NotificationInterceptor,
}
