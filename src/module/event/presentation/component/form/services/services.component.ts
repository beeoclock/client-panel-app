import {Component, inject, Input, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormInputComponent} from "@utility/presentation/component/input/form.input.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {FormTextareaComponent} from "@utility/presentation/component/input/form.textarea.component";
import {NgSelectModule} from "@ng-select/ng-select";
import humanizeDuration from "humanize-duration";
import {Duration} from "luxon";
import {
  ModalSelectServiceService
} from "@utility/presentation/component/modal-select-service/modal-select-service.service";
import {IService} from "@service/domain";
import {ModalSelectServiceListAdapter} from "@service/adapter/external/component/modal-select-service.list.adapter";
import {LinkButtonDirective} from "@utility/presentation/directives/button/link.button.directive";

@Component({
  selector: 'event-service-component',
  templateUrl: 'services.component.html',
  standalone: true,
  imports: [
    NgIf,
    TranslateModule,
    FormInputComponent,
    FormTextareaComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgForOf,
    CurrencyPipe,
    NgTemplateOutlet,
    LinkButtonDirective,
  ]
})
export class ServicesComponent implements OnInit {

  @Input()
  public serviceListControl: FormControl<IService[]> = new FormControl([] as any);

  private readonly modalSelectServiceService = inject(ModalSelectServiceService);
  private readonly modalSelectServiceListAdapter = inject(ModalSelectServiceListAdapter);
  private readonly translateService = inject(TranslateService);

  public readonly loading$ = this.modalSelectServiceListAdapter.loading$;

  public ngOnInit(): void {

    // this.serviceListControl.valueChanges.subscribe((value) => {
    //
    //   this.modalSelectServiceService.selectedServiceList = value;
    //
    // });

    this.initServices().then(() => {

      // this.modalSelectServiceService.selectedServiceList = this.serviceListControl.value;

    });

  }


  private async initServices() {

    if (!this.serviceListControl.value.length) {

      this.modalSelectServiceListAdapter.resetTableState();
      await this.modalSelectServiceListAdapter.getPageAsync();

      if (this.modalSelectServiceListAdapter.tableState.total === 1) {

        this.serviceListControl.patchValue([this.modalSelectServiceListAdapter.tableState.items[0]]);

      }

    }

  }

  public openModalToSelectService(): void {

    this.modalSelectServiceService.openServiceModal({
      multiSelect: false,
      selectedServiceList: this.serviceListControl.value
    }).then((newSelectedSpecialistList) => {

      this.serviceListControl.patchValue(newSelectedSpecialistList);

    });

  }

  public removeServiceFromSelectedList(service: IService): void {

    const newSelectedSpecialistList = this.serviceListControl.value.filter((value) => value._id !== service._id);

    this.serviceListControl.patchValue(newSelectedSpecialistList);

  }

  public formatDuration(duration: string): string {
    return humanizeDuration(Duration.fromISOTime(duration).as('milliseconds'), {language: this.translateService.currentLang});
  }


}
