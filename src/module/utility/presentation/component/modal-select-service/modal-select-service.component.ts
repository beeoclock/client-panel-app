import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {ModalSelectServiceListAdapter} from "@service/adapter/external/component/modal-select-service.list.adapter";
import {IService} from "@service/domain";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";
import {PrimaryButtonDirective} from "@utility/presentation/directives/button/primary.button.directive";
import {Router, RouterLink} from "@angular/router";
import {ModalButtonRoleEnum, ModalComponent} from "@utility/presentation/component/modal/modal.component";
import {NGXLogger} from "ngx-logger";
import {ServiceItemComponent} from "@service/presentation/component/list/item/item.componen";

@Component({
	selector: 'utility-modal-select-service-component',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgForOf,
		LoaderComponent,
		NgIf,
		TranslateModule,
		CurrencyPipe,
		BocMediaDirective,
		HumanizeDurationPipe,
		PrimaryButtonDirective,
		RouterLink,
		ServiceItemComponent
	],
	template: `
		<div class="flex flex-col gap-4">

			<ng-template [ngIf]="modalSelectServiceListAdapter.loading$.isOff && !modalSelectServiceListAdapter.tableState.items.length">
				{{ 'keyword.capitalize.dataNotFound' | translate }}
				<button type="button" primary (click)="goToServiceFormPage()">
					<i class="bi bi-plus-lg"></i>
					{{ 'keyword.capitalize.add-service' | translate }}
				</button>
			</ng-template>

			<ul class="grid w-full gap-6 md:grid-cols-1">
				<li *ngFor="let item of modalSelectServiceListAdapter.tableState.items; let index = index">
					<input type="radio" id="modal-select-service-{{ index }}" [checked]="isSelected(item)" name="modalSelectService" class="hidden peer" (change)="select(item)">
					<label
						for="modal-select-service-{{ index }}"
						class="
							w-full
							inline-flex
							cursor-pointer
							rounded-2xl
							bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 peer-checked:bg-blue-50
							border-4 border-gray-200 dark:border-gray-700 peer-checked:border-blue-200
							dark:hover:text-gray-300 dark:peer-checked:text-blue-500 peer-checked:text-blue-600 hover:text-gray-600
						">
						<service-item-component [item]="item"/>
					</label>
				</li>
			</ul>

		</div>
		<utility-loader *ngIf="modalSelectServiceListAdapter.loading$.isOn"/>
	`
})
export class ModalSelectServiceComponent implements OnInit {

	public readonly modalSelectServiceListAdapter = inject(ModalSelectServiceListAdapter);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);
	public readonly router = inject(Router);
	public readonly logger = inject(NGXLogger);

	public selectedServiceList: IService[] = [];
	public newSelectedServiceList: IService[] = [];

	public multiple = true;
	public modalInstance: ModalComponent | null = null;

	public ngOnInit(): void {

		this.newSelectedServiceList = [...(this.selectedServiceList ?? [])];
		this.initTableState().then();

	}

	public async submit(): Promise<IService[]> {
		return new Promise((resolve) => {
			resolve(this.newSelectedServiceList);
		});
	}

	public select(service: IService): void {
		if (!this.multiple) {
			if (this.newSelectedServiceList.length) {
				this.newSelectedServiceList.splice(0, 1);
			}
		}
		this.newSelectedServiceList.push(service);

		if (!this.modalInstance) {
			this.logger.error('modalInstance is not defined');
			return;
		}
		this.modalInstance.executeCallback(ModalButtonRoleEnum.accept);
		this.changeDetectorRef.detectChanges();
	}

	public deselect(service: IService): void {
		this.newSelectedServiceList = this.newSelectedServiceList.filter((selectedMember: IService) => selectedMember._id !== service._id);
		this.changeDetectorRef.detectChanges();
	}

	public isSelected(service: IService): boolean {
		return this.newSelectedServiceList.some((selectedMember: IService) => selectedMember._id === service._id);
	}

	public isNotSelected(service: IService): boolean {
		return !this.isSelected(service);
	}

	private async initTableState() {
		if (this.modalSelectServiceListAdapter.tableState.items.length) {
			return;
		}
		this.modalSelectServiceListAdapter.resetTableState();
		await this.modalSelectServiceListAdapter.getPageAsync();
		this.changeDetectorRef.detectChanges();
	}

	public goToServiceFormPage() {
		if (!this.modalInstance) {
			this.logger.error('modalInstance is not defined');
			return;
		}
		this.modalInstance.closeModal();
		this.router.navigate(['/', 'service', 'form']).then();
	}
}
