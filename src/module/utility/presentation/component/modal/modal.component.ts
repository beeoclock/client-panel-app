import {AfterViewInit, Component, ElementRef, Input, ViewChild} from "@angular/core";
import {Modal, ModalInterface, ModalOptions} from "flowbite";
import {NgIf} from "@angular/common";

@Component({
  selector: 'utility-modal',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `

    <!-- Modal toggle -->
    <button
      #buttonRef
      *ngIf="useButton"
      (click)="show()"
      data-modal-target="defaultModal"
      data-modal-toggle="defaultModal"
      class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      type="button">
      {{ buttonLabel }}
    </button>

    <!-- Main modal -->
    <div
      #modalRef
      id="defaultModal"
      data-modal-backdrop="static"
      tabindex="-1"
      aria-hidden="true"
      class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">

          <!-- Modal header -->
          <div class="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              <ng-content select="[header]"></ng-content>
            </h3>
            <button
              type="button"
              (click)="hide()"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="defaultModal">
              <i class="bi bi-x-lg w-5 h-5"></i>
              <span class="sr-only">Close modal</span>
            </button>
          </div>

          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <ng-content select="[body]"></ng-content>
          </div>

          <!-- Modal footer -->
          <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <ng-content select="[footer]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent implements AfterViewInit {

  @Input()
  public useButton = true;

  @Input()
  public buttonLabel = 'Open modal';

  @ViewChild('buttonRef')
  public buttonRef: ElementRef<HTMLButtonElement> | undefined;

  @ViewChild('modalRef')
  public modalRef: ElementRef<HTMLDivElement> | undefined;

  #modal: ModalInterface | undefined;

  public get modal(): ModalInterface | undefined {

    return this.#modal;

  }

  public readonly backdropClasses = 'bg-black bg-opacity-50 dark:bg-opacity-80 fixed h-full inset-0 left-0 top-0 w-full z-40';

  public ngAfterViewInit(): void {

    if (this.modalRef) {

      const options: ModalOptions = {
        backdrop: 'static',
        backdropClasses: this.backdropClasses,
        closable: true,
      };

      this.#modal = new Modal(this.modalRef.nativeElement, options);

    }

  }

  public show(): void {

    this.#modal?.show();

  }

  public hide(): void {

    this.#modal?.hide();

  }

}
