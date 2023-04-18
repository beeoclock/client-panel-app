import {Observable, Subject} from 'rxjs';

export class Notification {

  static #stream$: Subject<Notification> = new Subject<Notification>();
  public static stream$: Observable<Notification> = this.#stream$.asObservable();

  public static push(value: Notification): void {
    this.#stream$.next(value);
  }

  public readonly id: string;

  constructor(
    public readonly message: string,
  ) {
    this.id = Date.now().toString();
  }

}
