import {Component, HostBinding, ViewEncapsulation} from '@angular/core';
import {Notification} from '@utility/notification';
import {AsyncPipe, NgForOf} from '@angular/common';

@Component({
  selector: 'utility-stream-toast-component',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    AsyncPipe,
    NgForOf
  ],
  template: `
    <ng-container *ngFor="let notification of queueNotification">
      <div class="toast show text-bg-success border-0">
        <div class="d-flex">
          <div class="toast-body text-white">
            {{ notification.message }}
          </div>
          <button
            (click)="delete(notification.id)"
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
      this.queueNotification.push(notification);
    });
  }

  public delete(deleteId: string): void {
    this.queueNotification = this.queueNotification.filter(({id}) => id === deleteId);
  }

}
