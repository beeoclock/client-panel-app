import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {Notification, NotificationStateEnum} from '@utility/notification';
import {AsyncPipe, NgClass, NgForOf} from '@angular/common';

@Component({
  selector: 'utility-stream-toast-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    AsyncPipe,
    NgForOf,
    NgClass
  ],
  template: `
    <ng-container *ngFor="let notification of queueNotification">
      <div class="toast show border-0" [ngClass]="getBgClass(notification.data.state)">
        <div class="d-flex">
          <div class="toast-body text-white">
            {{ notification.data.message }}
          </div>
          <button
            (click)="delete(notification.id)"
            [id]="'notification-delete-button-' + notification.id"
            type="button"
            class="btn btn-link px-2 text-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </ng-container>
  `
})
export class StreamToastComponent {

  @HostBinding()
  public class = ['toast-container', 'translate-middle-x', 'start-50', 'position-fixed', 'bottom-0', 'mb-4'];

  @HostBinding()
  public role = 'alert';

  @HostBinding('attr.aria-live')
  public ariaLive = 'polite';

  @HostBinding('attr.atomic-live')
  public ariaAtomic = 'true';

  public queueNotification: Notification[] = [];

  constructor() {
    Notification.stream$.subscribe((notification) => {
      this.initTimer(notification.id, notification.data.delay);
      this.queueNotification.push(notification);
    });
  }

  private initTimer(id: string, delay: undefined | number | false): void {
    if (delay !== false) {
      setTimeout(() => {
        this.delete(id);
      }, delay);
    }
  }

  public delete(deleteId: string): void {
    this.queueNotification = this.queueNotification.filter(({id}) => id === deleteId);
  }

  public getBgClass(state: undefined | NotificationStateEnum): string {
    return {
      [NotificationStateEnum.SUCCESS]: 'text-bg-success',
      [NotificationStateEnum.DANGER]: 'text-bg-danger',
      [NotificationStateEnum.INFO]: 'text-bg-info',
      [NotificationStateEnum.WARNING]: 'text-bg-warning',
    }[state ?? NotificationStateEnum.SUCCESS];
  }
}
