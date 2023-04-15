import {AfterViewInit, Directive, ElementRef, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Directive({
  selector: '[togglePassword]'
})
export class TogglePasswordDirective implements AfterViewInit {

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,
    private readonly elementRef: ElementRef<HTMLInputElement>,
  ) {
  }

  public get isToggle(): boolean {
    return this.elementRef.nativeElement.hasAttribute('data-toggle');
  }

  public ngAfterViewInit(): void {

    this.elementRef.nativeElement.type = 'password';
    this.initToggleButton();

  }

  public initToggleButton(): void {

    const {nativeElement} = this.elementRef;

    if (nativeElement) {
      const button: HTMLButtonElement = this.document.createElement('button');
      button.id = nativeElement.id + '-button-toggle';
      button.classList.add(...['btn', 'btn-primary', 'd-flex', 'align-items-center', 'border-start-0']);
      button.setAttribute('role', 'togglePassword');
      button.type = 'button';
      this.setIconFor(button);

      button.addEventListener('click', () => {
        nativeElement.toggleAttribute('data-toggle');
        nativeElement.type = this.isToggle ? 'text' : 'password';
        nativeElement.focus();
        this.setIconFor(button);
      });

      const {parentElement} = nativeElement;

      if (parentElement) {

        if (parentElement.childElementCount > 1) {
          const childList: HTMLCollection = parentElement.children;
          for (let i = 0; i < childList.length; i++) {
            if (childList[i] instanceof HTMLInputElement) {
              childList[i].after(button);
              break;
            }
          }
        } else {
          parentElement.append(button);
        }

      }

    }

  }

  /**
   *
   * @param toggle
   */
  public nameOfIcon(toggle: boolean): string {
    if (toggle) {
      return 'eye-slash';
    }
    return 'eye';
  }

  private setIconFor(button: HTMLButtonElement): void {

    const icon: HTMLElement = this.document.createElement('i');
    icon.classList.add(...['bi', `bi-${this.nameOfIcon(this.isToggle)}`]);

    button.innerHTML = ``;
    button.append(icon);

  }
}
