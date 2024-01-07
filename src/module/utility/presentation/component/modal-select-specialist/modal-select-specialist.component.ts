import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {
	ModalSelectSpecialistListAdapter
} from "@member/adapter/external/component/modal-select-specialist.list.adapter";
import {NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {RIMember} from "@member/domain";
import {TranslateModule} from "@ngx-translate/core";
import {ISpecialist} from "@service/domain/interface/i.specialist";
import {Service} from "@src/module/service/domain";

@Component({
	selector: 'utility-modal-select-specialist-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		LoaderComponent,
		NgIf,
		TranslateModule
	],
	template: `
        <ng-container *ngFor="let member of modalSelectSpecialistListAdapter.tableState.items">

            <div class="grid grid-cols-16 gap-3">
                <div class="col-span-3">
                    <div class="w-[100px] h-[100px] rounded-full bg-beeColor-300">

                    </div>
                </div>
                <div class="col-span-9 flex items-center">
                    <div class="flex flex-col">
                        <div>
                            {{ member.firstName }} {{ member.lastName }}
                        </div>
                        <div>
                            {{ member.email }}
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                <div class="col-span-4 flex items-center">
                    <button
                            *ngIf="isSelected(member)"
                            (click)="deselect(member)"
                            type="button"
                            class="w-full border border-green-200 bg-green-50 px-4 py-2 rounded-2xl">
                        {{ 'keyword.capitalize.selected' | translate }}
                    </button>
                    <button
                            *ngIf="isNotSelected(member)"
                            (click)="select(member)"
                            type="button"
                            class="w-full border border-blue-200 bg-blue-50 px-4 py-2 rounded-2xl">
                        {{ 'keyword.capitalize.select' | translate }}
                    </button>
                </div>
            </div>

        </ng-container>
        <utility-loader *ngIf="modalSelectSpecialistListAdapter.loading$.isTrue"/>
    `
})
export class ModalSelectSpecialistComponent implements OnInit {

	public readonly modalSelectSpecialistListAdapter = inject(ModalSelectSpecialistListAdapter);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);

	public selectedSpecialistList: ISpecialist[] = [];
	public newSelectedSpecialistList: ISpecialist[] = [];

	public ngOnInit(): void {

		this.newSelectedSpecialistList = [...this.selectedSpecialistList];
		this.initTableState().then();

	}

	public async submit(): Promise<ISpecialist[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedSpecialistList);
		});
	}

	public select(member: RIMember): void {
		this.newSelectedSpecialistList.push(Service.memberToSpecialist(member));
		this.changeDetectorRef.detectChanges();
	}

	public deselect(member: RIMember): void {
		this.newSelectedSpecialistList = this.newSelectedSpecialistList.filter((specialist: ISpecialist) => specialist?.member?._id !== member._id);
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(member: RIMember): boolean {
		return this.newSelectedSpecialistList.some((specialist: ISpecialist) => specialist?.member?._id === member._id);
	}

	public isNotSelected(member: RIMember): boolean {
		return !this.isSelected(member);
	}

	private async initTableState() {
		this.modalSelectSpecialistListAdapter.resetTableState();
		await this.modalSelectSpecialistListAdapter.getPageAsync();
		this.changeDetectorRef.detectChanges();
	}
}
