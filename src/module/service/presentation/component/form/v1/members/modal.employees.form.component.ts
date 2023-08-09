import {Component} from "@angular/core";
import {ModalComponent} from "@utility/presentation/component/modal/modal.component";

@Component({
  selector: 'service-modal-members-form-component',
  standalone: true,
  imports: [
    ModalComponent
  ],
  template: `
    <utility-modal #modalRef>
      <div header>
        hello world
      </div>
      <div body>
        hello world
      </div>
      <div footer>
        <button data-modal-hide="defaultModal" type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          I accept
        </button>
        <button
          (click)="modalRef.closeModal()"
          data-modal-hide="defaultModal"
          type="button"
          class="text-beeColor-500 bg-white hover:bg-beeColor-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-beeColor-200 text-sm font-medium px-5 py-2.5 hover:text-beeColor-900 focus:z-10 dark:bg-beeDarkColor-700 dark:text-beeDarkColor-300 dark:border-beeDarkColor-500 dark:hover:text-white dark:hover:bg-beeDarkColor-600 dark:focus:ring-beeDarkColor-600">
          Decline
        </button>
      </div>
    </utility-modal>
  `
})
export class ModalMembersFormComponent {

}
