import {Observable, Subject} from 'rxjs';

export enum DelayEnum {
  SECOND = 1_000,
  TWO_SECONDS = 2_000,
  THREE_SECONDS = 3_000,
  FOUR_SECONDS = 4_000,
  FIVE_SECONDS = 5_000,
}

export enum NotificationStateEnum {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
  INFO = 'INFO',
}

export interface INotificationData {
  message: string,
  state?: NotificationStateEnum,
  delay?: number | false,
}

export class Notification {

  protected static _stream$: Subject<Notification> = new Subject<Notification>();
  public static stream$: Observable<Notification> = this._stream$.asObservable();

  public static push(value: Notification | INotificationData): void {
    if (!(value instanceof Notification)) {
      value = new this(value);
    }
    this._stream$.next(value);
  }

  public readonly id: string;

  constructor(
    public readonly data: INotificationData,
    defaultState: NotificationStateEnum = NotificationStateEnum.SUCCESS
  ) {
    this.data.delay = this.data?.delay ?? DelayEnum.THREE_SECONDS;
    this.data.state = this.data?.state ?? defaultState;
    this.id = Date.now().toString();
  }

}

export class WarningNotification extends Notification {
  constructor(
    public override readonly data: INotificationData,
  ) {
    super(data, NotificationStateEnum.WARNING);
  }
}

export class InfoNotification extends Notification {
  constructor(
    public override readonly data: INotificationData,
  ) {
    super(data, NotificationStateEnum.INFO);
  }
}

export class DangerNotification extends Notification {
  constructor(
    public override readonly data: INotificationData,
  ) {
    super(data, NotificationStateEnum.DANGER);
  }
}
