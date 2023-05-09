import {AfterViewInit, Component, ComponentRef, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {Modal} from 'bootstrap';
import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {TypeGuard} from '@p4ck493/ts-type-guard';
import {Reactive} from "@utility/cdk/reactive";
import {is} from "thiis";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {SpinnerComponent} from "@utility/presentation/component/spinner/spinner.component";

export enum ModalButtonRoleEnum {
  'cancel',
  'accept',
}

export interface ModalButtonInterface {
  text?: string;
  role?: ModalButtonRoleEnum;
  value?: any;
  enabledDebounceClick?: boolean;
  disabled?: boolean;
  loading?: boolean;
  classList?: string[];
  callback?: (modal: ModalComponent, instanceList: any[]) => void;
}

export type modalSizeType = 'modal-sm' | '' | 'modal-lg' | 'modal-xl';

@Component({
  selector: 'utility-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    SpinnerComponent
  ],
})
export class ModalComponent extends Reactive implements AfterViewInit {

  @ViewChild('modalRef')
  public modalRef: ElementRef<HTMLElement> | undefined;

  @ViewChild('contentRef')
  public contentRef: ElementRef<HTMLElement> | undefined;

  @ViewChild('btnCloseRef')
  public btnCloseRef: ElementRef<HTMLButtonElement> | undefined;

  public titleClasses: string[] = ['fw-bold', 'd-flex', 'align-items-center'];

  public modalSize: modalSizeType = '';

  public showBody = true;

  public fixHeight = true;

  public readonly id!: string;

  public readonly idPrefix: string = `${this.id}_buttons_`;

  #modal: undefined | Modal;

  private readonly closeModal$: Subject<void> = new Subject<void>();

  public buttonSectionClass: string[] = ['modal-footer', 'flex-nowrap', 'justify-content-between'];

  public modalOptions: Partial<Modal.Options> = {
    backdrop: 'static',
    keyboard: true,
    focus: true,
  };

  public buttons: ModalButtonInterface[] = [
    {
      text: 'Cancel',
      role: ModalButtonRoleEnum.cancel,
      value: false,
      disabled: false,
      enabledDebounceClick: false,
      classList: ['btn btn-secondary']
    },
    {
      text: 'Continue',
      role: ModalButtonRoleEnum.accept,
      value: true,
      disabled: false,
      enabledDebounceClick: true,
      classList: ['btn btn-primary']
    }
  ];

  public title = 'Title';

  public contentHTML: string | undefined;

  public componentChildRefList: ComponentRef<any>[] = [];

  public externalMethodOnCloseModalEvent: ((id: string) => void) | undefined;

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @HostListener('document:keydown.enter')
  private handleOnEnterKey(): void {
    this.executeCallback(ModalButtonRoleEnum.accept);
  }

  @HostListener('document:keydown.escape')
  private handleOnEscapeKey(): void {
    this.executeCallback(ModalButtonRoleEnum.cancel);
  }

  /**
   *
   * @param theRole
   * @private
   */
  @TypeGuard([is.not.null.or.undefined])
  private executeCallback(theRole: ModalButtonRoleEnum): void {
    this.getButton(theRole)?.callback?.(this, this.getInstanceList());
  }

  /**
   *
   * @private
   * @param theRole
   */
  @TypeGuard([is.not.null.or.undefined])
  public getButton(theRole: ModalButtonRoleEnum): ModalButtonInterface | null {
    return this.buttons?.find(({role}) => role === theRole) ?? null;
  }

  public getButtonById(role: ModalButtonRoleEnum): HTMLButtonElement | null {
    return (this.elementRef.nativeElement?.querySelector?.(`#${this.idPrefix + role}`) as HTMLButtonElement) ?? null;
  }

  public toggleButtonDisable(button: HTMLButtonElement, force?: boolean): void {
    button.toggleAttribute('disabled', force ?? !button?.disabled);
  }

  public ngAfterViewInit(): void {
    this.initModal();
    this.deleteContentIfEmpty();
    this.initHandleOnCloseModalButton();
  }

  private initModal(): void {
    if (this.modalRef) {
      this.#modal = new Modal(this.modalRef.nativeElement, this.modalOptions);
      this.#modal.show();

      this.closeModal$.pipe(take(1), this.takeUntil()).subscribe(() => {

        this.#modal?.hide();
        setTimeout(() => {
          try {
            this.externalMethodOnCloseModalEvent?.(this.id);
            this.elementRef?.nativeElement?.remove();
          } catch (error) {
            console.error(error);
          }
        }, 500);

      });
      this.initHandleOnCloseModal();
    }

  }

  public get modal(): undefined | Modal {
    return this.#modal;
  }

  public show(): Promise<void> {

    return new Promise<void>((resolve) => {

      if (this.#modal) {
        this.#modal.show();
      }

      setTimeout(() => {
        resolve();
      }, 500);
    });

  }

  private initHandleOnCloseModal(): void {

    if (this.#modal) {
      (<any>this.#modal)['_element'].addEventListener('hidden.bs.modal', () => {
        this.closeModal$.next();
      });
    }

  }

  /**
   *
   * @private
   */
  public closeModal(): void {
    this.closeModal$.next();
  }

  /**
   *
   * @param $event
   * @param button
   */
  @TypeGuard([is.not.null.or.undefined])
  public buttonAction($event: MouseEvent, button: ModalButtonInterface): void {

    if (button?.callback) {
      button.callback(this, this.getInstanceList());
    }

  }

  private deleteContentIfEmpty(): void {
    if (!this.contentRef?.nativeElement?.firstChild) {
      this.contentRef?.nativeElement?.remove();
    }
  }

  private getInstanceList(): any[] {
    return this.componentChildRefList?.map((componentRef) => componentRef.instance);
  }

  private initHandleOnCloseModalButton(): void {
    this.btnCloseRef?.nativeElement.addEventListener('click', () => {
      this.executeCallback(ModalButtonRoleEnum.cancel);
    });
  }
}
