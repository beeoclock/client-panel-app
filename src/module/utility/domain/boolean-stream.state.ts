import {BehaviorSubject} from "rxjs";

export class BooleanStreamState {

  readonly #state$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.state);
  public readonly state$ = this.#state$.asObservable();

  constructor(
    private state: boolean = true,
  ) {
  }

  public get isOn(): boolean {
    return this.#state$.value;
  }

  public get isOff(): boolean {
    return !this.isOn;
  }

  public toggle(force?: boolean): void {
    this.#state$.next(force ?? !this.isOn);
  }

  public switchOn(): void {
    this.toggle(true);
  }

  public switchOff(): void {
    this.toggle(false);
  }
}
