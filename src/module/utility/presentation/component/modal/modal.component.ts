import {
	AfterViewInit,
	Component,
	ComponentRef,
	ElementRef,
	HostListener,
	inject,
	Input,
	ViewChild
} from "@angular/core";
import {Modal, ModalInterface, ModalOptions} from "flowbite";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {is} from "thiis";
import {TypeGuard} from "@p4ck493/ts-type-guard";
import {Subject, take} from "rxjs";
import {Reactive} from "@utility/cdk/reactive";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {DebounceClickDirective} from "@utility/presentation/directives/debounce/debounce.directive";
import {NGXLogger} from "ngx-logger";

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

@Component({
  selector: 'utility-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    DebounceClickDirective,
    LoaderComponent,
    TranslateModule
  ],
  template: `
    <div
      #modalRef
      [id]="id"
      data-modal-backdrop="static"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full md:p-4 overflow-x-hidden overflow-y-auto md:inset-0 max-h-full">
      <div class="relative w-full max-w-2xl max-h-full">

        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow h-screen md:h-auto dark:bg-beeDarkColor-800">

          <!-- Modal header -->
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-beeDarkColor-600">
            <h3 [ngClass]="titleClasses" [id]="id + '_label'" [innerHtml]="title">
            </h3>
            <button
              type="button"
              #btnCloseRef
              (click)="closeModal()"
              class="text-beeColor-400 bg-transparent hover:bg-beeColor-200 hover:text-beeColor-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-beeDarkColor-600 dark:hover:text-white"
              data-modal-hide="defaultModal">
              <i class="bi bi-x-lg w-5 h-5"></i>
              <span class="sr-only">Close modal</span>
            </button>
          </div>

          <!-- Modal body -->
          <div #contentRef class="p-6 space-y-6 overflow-y-auto h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] md:h-auto md:max-h-[calc(100vh-16rem)]">
            <ng-content/>
          </div>

          <!-- Modal footer -->
          <div *ngIf="buttons?.length"
               class="flex items-center p-6 space-x-2 border-t border-beeColor-200 rounded-b dark:border-beeDarkColor-600 justify-between">

            <button
              type="button"
              *ngFor="let button of buttons"
              [id]="idPrefix + button.role"
              [ngClass]="button.classList"
              [disabled]="button?.disabled"
              appDebounceClick
              [enabledDebounceClick]="button?.enabledDebounceClick ?? true"
              (debounceClick)="buttonAction($event, button)">

              <div
                class="inline-flex items-center font-semibold leading-6 text-sm text-white transition ease-in-out duration-150 cursor-not-allowed"
                *ngIf="button?.loading; else DefaultTemplate">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ 'keyword.capitalize.processing' | translate }}...
              </div>

              <ng-template #DefaultTemplate>
                {{ button?.text }}
              </ng-template>

            </button>

          </div>

        </div>

      </div>

    </div>
  `
})
export class ModalComponent extends Reactive implements AfterViewInit {

  @Input()
  public id = 'modal-default-id';

  @ViewChild('contentRef')
  public contentRef: ElementRef<HTMLElement> | undefined;

  @ViewChild('btnCloseRef')
  public btnCloseRef: ElementRef<HTMLButtonElement> | undefined;

  private readonly logger = inject(NGXLogger);
  private readonly translateService = inject(TranslateService);

  public static buttons = {
    [ModalButtonRoleEnum.accept]: {
      classList: ['text-white', 'bg-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'rounded-lg', 'text-sm', 'px-5', 'py-2.5', 'text-center', 'dark:bg-blue-600', 'dark:hover:bg-blue-700', 'dark:focus:ring-blue-800', 'flex']
    },
    [ModalButtonRoleEnum.cancel]: {
      classList: ['text-beeColor-500', 'bg-white', 'hover:bg-beeColor-100', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'rounded-lg', 'border', 'border-beeColor-200', 'text-sm', 'font-medium', 'px-5', 'py-2.5', 'hover:text-beeColor-900', 'focus:z-10', 'dark:bg-beeDarkColor-700', 'dark:text-beeDarkColor-300', 'dark:border-beeDarkColor-500', 'dark:hover:text-white', 'dark:hover:bg-beeDarkColor-600', 'dark:focus:ring-beeDarkColor-600']
    }
  };

  public titleClasses: string[] = ['text-xl', 'font-semibold', 'text-beeColor-900', 'dark:text-white'];

  public readonly idPrefix: string = `${this.id}_buttons_`;

  private readonly closeModal$ = new Subject<void>();

  public title = 'Title';

  public readonly backdropClasses = 'bg-black bg-opacity-50 dark:bg-opacity-80 fixed h-full inset-0 left-0 top-0 w-full z-40';

  public modalOptions: ModalOptions = {
    backdrop: 'static',
    backdropClasses: this.backdropClasses,
    closable: true,
  };

  public buttons: ModalButtonInterface[] = [
    {
      text: this.translateService.instant('keyword.capitalize.cancel'),
      role: ModalButtonRoleEnum.cancel,
      value: false,
      disabled: false,
      enabledDebounceClick: false,
      classList: ModalComponent.buttons[ModalButtonRoleEnum.cancel].classList,
    },
    {
      text: this.translateService.instant('keyword.capitalize.confirm'),
      role: ModalButtonRoleEnum.accept,
      value: true,
      disabled: false,
      enabledDebounceClick: true,
      classList: ModalComponent.buttons[ModalButtonRoleEnum.accept].classList
    }
  ];

  public componentChildRefList: ComponentRef<any>[] = [];

  public externalMethodOnCloseModalEvent: ((id: string) => void) | undefined;

  //

  @Input()
  public useButton = true;

  @Input()
  public buttonLabel = 'Open modal';

  @ViewChild('modalRef')
  public modalRef: ElementRef<HTMLDivElement> | undefined;

  #modal: ModalInterface | undefined;

  public get modal(): ModalInterface | undefined {

    return this.#modal;

  }

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  public ngAfterViewInit(): void {

    this.initModal();
    this.deleteContentIfEmpty();
    this.initHandleOnCloseModalButton();

  }

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

  private initModal(): void {

    if (this.modalRef) {

      this.#modal = new Modal(this.modalRef.nativeElement, this.modalOptions);
      this.#modal?.show();

    }

    this.closeModal$.pipe(take(1), this.takeUntil()).subscribe(() => {

      this.#modal?.hide();
      setTimeout(() => {
        try {
          this.externalMethodOnCloseModalEvent?.(this.id);
          this.elementRef?.nativeElement?.remove();
        } catch (error) {
					this.logger.error(error);
        }
      }, 500);

    });

  }

  public show(): Promise<void> {

    return new Promise<void>((resolve) => {

      this.#modal?.show();

      setTimeout(() => {
        resolve();
      }, 500);
    });

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
