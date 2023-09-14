import {AfterViewInit, Component, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {NgSelectModule} from "@ng-select/ng-select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IMember} from "@member/domain";
import {
	ModalMembersFormComponent
} from "@service/presentation/component/form/v1/members/modal.employees.form.component";
import {ListMemberApiAdapter} from "@member/adapter/external/api/list.member.api.adapter";

@Component({
  selector: 'service-members-form-component',
  standalone: true,
  imports: [
    NgForOf,
    NgSelectModule,
    ReactiveFormsModule,
    NgIf,
    ModalMembersFormComponent
  ],
  template: `

    <div class="bg-white dark:bg-beeDarkColor-800 dark:border dark:border-beeDarkColor-700 shadow rounded-2xl p-4 mt-4">
      <!--    <h4>-->
      <!--      Members that can do the service-->
      <!--    </h4>-->
      <!--    <service-modal-members-form-component>-->
      <!--    </service-modal-members-form-component>-->
      <div class="col-12 position-relative" *ngIf="control">
        <label for="service-form-members">Members</label>
        <ng-select
          id="service-form-members"
          class="cursor-pointer"
          placeholder="Select members"
          bindLabel="_id"
          (scrollToEnd)="scrollToEnd($event)"
          [closeOnSelect]="false"
          [loading]="control.pending"
          [disabled]="control.pending"
          [multiple]="multiple"
          [formControl]="control">
          <ng-template ng-label-tmp let-item="item" let-clear="clear">
            <span>{{ getLabel(item) }}</span>
            <span class="ng-value-icon right" (click)="clear(item)" aria-hidden="true">×</span>
          </ng-template>
          <ng-template ng-header-tmp>

            <div>
              <button type="button" class="text-blue-600 mx-2"
                      (click)="onSelectAll()">Select All
              </button>
              <button type="button" class="text-blue-600 mx-2"
                      (click)="onClearAll()">Clear All
              </button>
            </div>

          </ng-template>
          <ng-option *ngFor="let item of items" [value]="item">
            {{ getLabel(item) }}
          </ng-option>
        </ng-select>
      </div>
    </div>
  `
})
export class MembersFormComponent implements AfterViewInit {

  @Input()
  public control!: FormControl;

  @Input()
  public multiple = true;

  public items: IMember[] = [];

  // TODO create external adapter (in event module) for the module (service)
  private readonly listMemberApiAdapter = inject(ListMemberApiAdapter);

  public ngAfterViewInit(): void {
    this.control.markAsPending();
    this.listMemberApiAdapter
      .executeAsync({
        pageSize: 10,
        page: 1,
        orderBy: 'createdAt',
        orderDir: 'asc',
        filters: {}
      })
      .then((result) => {
        this.items = result.items;
        this.control.updateValueAndValidity();
      });

  }

  public onSelectAll() {
    const selected = this.items;
    this.control.patchValue(selected);
  }

  public onClearAll() {
    this.control.patchValue([]);
  }

  public scrollToEnd($event: any) {
    console.log($event);
  }

  public getLabel(item: IMember): string {
    if (item.firstName && item.lastName) {
      return `(${item.firstName} ${item.lastName}) ${item.email}`
    }
    return item.email;
  }
}
