import {Component, inject, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {
  ModalSelectSpecialistService
} from "@utility/presentation/component/modal-select-specialist/modal-select-specialist.service";
import {
  ModalSelectSpecialistListAdapter
} from "@member/adapter/external/component/modal-select-specialist.list.adapter";
import {IMember} from "@member/domain";

@Component({
  selector: 'service-form-specialists-block-component',
  standalone: true,
  template: `
<!--    <div-->
<!--      class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl p-4 flex flex-col gap-3">-->
<!--      <span class="text-2xl font-bold text-gray-500">{{ 'general.specialists' | translate }}</span>-->

<!--      <div *ngFor="let member of specialistListControl.value; let index = index">-->


<!--        <div class="grid grid-cols-16 gap-3">-->
<!--          <div class="col-span-3">-->
<!--            <div class="w-[100px] h-[100px] rounded-full bg-gray-300">-->

<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-span-9 flex items-center">-->
<!--            <div class="flex flex-col">-->
<!--              <div>-->
<!--                {{ member.firstName }} {{ member.lastName }}-->
<!--              </div>-->
<!--              <div>-->
<!--                {{ member.email }}-->
<!--              </div>-->
<!--              <div></div>-->
<!--              <div></div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="col-span-4 flex items-start justify-end">-->
<!--            <button (click)="removeMemberFromSelectedList(member)"-->
<!--                    class="text-gray-600 hover:text-red-600 hover:bg-red-100 px-2 py-1 rounded-2xl">-->
<!--              <i class="bi bi-trash"></i>-->
<!--            </button>-->
<!--          </div>-->
<!--        </div>-->

<!--        <hr class="mt-4">-->

<!--      </div>-->

<!--      <button (click)="openModalToSelectSpecialist()"-->
<!--              class="w-full text-blue-600 rounded px-4 py-2 hover:bg-blue-100 flex items-center justify-center gap-3">-->
<!--        <i class="bi bi-list-check"></i>-->
<!--        {{ 'general.selectSpecialist' | translate }}-->
<!--      </button>-->

<!--    </div>-->
  `,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgForOf,
  ]
})
export class SpecialistsBlockComponent implements OnInit {

  public readonly modalSelectSpecialistService = inject(ModalSelectSpecialistService);
  public readonly modalSelectSpecialistListAdapter = inject(ModalSelectSpecialistListAdapter);

  @Input()
  public specialistListControl: FormControl<IMember[]> = new FormControl([] as any);

  public ngOnInit(): void {

    this.specialistListControl.valueChanges.subscribe((value) => {

      this.modalSelectSpecialistService.selectedSpecialistList = value;

    });

    this.initSpecialists().then(() => {

      this.modalSelectSpecialistService.selectedSpecialistList = this.specialistListControl.value;

    });

  }


  private async initSpecialists() {

    if (!this.specialistListControl.value.length) {

      this.modalSelectSpecialistListAdapter.resetTableState();
      await this.modalSelectSpecialistListAdapter.getPageAsync();

      if (this.modalSelectSpecialistListAdapter.tableState.total === 1) {

        this.specialistListControl.patchValue([this.modalSelectSpecialistListAdapter.tableState.items[0]]);

      }

    }

  }

  public openModalToSelectSpecialist(): void {

    this.modalSelectSpecialistService.openServiceModal().then((newSelectedSpecialistList) => {

      this.specialistListControl.patchValue(newSelectedSpecialistList);

    });

  }

  public removeMemberFromSelectedList(member: IMember): void {

    const newSelectedSpecialistList = this.specialistListControl.value.filter((value) => value._id !== member._id);

    this.specialistListControl.patchValue(newSelectedSpecialistList);

  }
}
