import {Component, EventEmitter, Input, Output} from "@angular/core";
import {RouterLink} from "@angular/router";
import {DropdownComponent} from "@utility/presentation/component/dropdown/dropdown.component";
import {ActiveEnum} from "@utility/domain/enum";
import {NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {Placement} from "@popperjs/core/lib/enums";

@Component({
  selector: 'utility-table-column-action',
  standalone: true,
  imports: [
    RouterLink,
    DropdownComponent,
    NgIf,
    TranslateModule
  ],
  template: `
    <utility-dropdown [placement]="placement" [offsetDistance]="offsetDistance" [threeDot]="true" [id]="'table-row-' + id">
      <ng-container content>
        <li>
          <a
            [routerLink]="id"
            class="flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
            <i class="bi bi-eye"></i>
            {{ 'keyword.capitalize.details' | translate }}
          </a>
        </li>
        <li>
          <a
            [routerLink]="[id, 'form']"
            class="flex gap-4 text-start px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">
            <i class="bi bi-pencil"></i>
            {{ 'keyword.capitalize.edit' | translate }}
          </a>
        </li>
				<ng-content/>
<!--        <li *ngIf="active === activeEnum.NO">-->
<!--          <button-->
<!--            (click)="delete.emit(id)"-->
<!--            class="text-start block w-full px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">-->
<!--            <i class="bi bi-trash"></i>-->
<!--            {{ 'keyword.capitalize.delete' | translate }}-->
<!--          </button>-->
<!--        </li>-->
<!--        <li *ngIf="active === activeEnum.YES">-->
<!--          <button-->
<!--            (click)="archive.emit(id)"-->
<!--            class="text-start block w-full px-4 py-2 hover:bg-beeColor-100 dark:hover:bg-beeDarkColor-600 dark:hover:text-white">-->
<!--            <i class="bi bi-archive"></i>-->
<!--            Archive-->
<!--          </button>-->
<!--        </li>-->
      </ng-container>
    </utility-dropdown>
  `
})
export class ActionComponent {

  @Input()
  public id!: string;

  @Input()
  public active!: ActiveEnum;

  @Input()
  public placement: Placement = 'auto';

  @Input()
  public offsetDistance = 26;

  @Output()
  public readonly delete = new EventEmitter<string>();

  @Output()
  public readonly archive = new EventEmitter<string>();

  public readonly activeEnum = ActiveEnum;

}
