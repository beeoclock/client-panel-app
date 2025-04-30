export class BooleanState {
  constructor(
    private state: boolean = true,
  ) {
  }

  public get isOn(): boolean {
    return this.state;
  }

  public get isOff(): boolean {
    return !this.isOn;
  }

  public toggle(force?: boolean): void {
    this.state = force ?? !this.state;
  }

  public switchOn(): void {
    this.toggle(true);
  }

  public switchOff(): void {
    this.toggle(false);
  }
}
