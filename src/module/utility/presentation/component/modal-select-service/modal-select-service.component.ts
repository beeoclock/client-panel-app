import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "@utility/presentation/component/loader/loader.component";
import {TranslateModule} from "@ngx-translate/core";
import {ModalSelectServiceListAdapter} from "@service/adapter/external/component/modal-select-service.list.adapter";
import {IService} from "@service/domain";
import {BocMediaDirective} from "@module/media/presentation/directive/boc-media/boc-media.directive";
import {HumanizeDurationPipe} from "@utility/presentation/pipes/humanize-duration.pipe";

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
		HumanizeDurationPipe
	],
	template: `
		<div class="flex flex-col gap-4">

			<ul class="grid w-full gap-6 md:grid-cols-1">
				<li *ngFor="let item of modalSelectServiceListAdapter.tableState.items; let index = index">
					<input type="radio" id="modal-select-service-{{ index }}" [checked]="isSelected(item)" name="modalSelectService" class="hidden peer" (change)="select(item)">
					<label for="modal-select-service-{{ index }}" class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-2xl cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
						<div class="flex gap-3 mr-3">
							<div class="">
								<img
									bocMedia
									[src]="item.presentation.banners[0]"
									twHeight="h-[90px]"
									twWidth="w-[90px]"
									class="hidden w-[90px] h-[90px] rounded-2xl object-cover"
									alt="Image of service">
							</div>
							<div class="flex flex-col flex-1">
								<div class="w-full text-lg font-semibold">{{ item.languageVersions[0].title }}</div>
								<div class="w-full hidden lg:block">{{ item.languageVersions[0].description }}</div>
							</div>
						</div>
						<div class="flex flex-col items-center">
                <span class="text-end text-sm whitespace-nowrap">
                {{ item.durationVersions[0].prices[0].price | currency: item.durationVersions[0].prices[0].currency: 'symbol-narrow' }}
              </span>
							<span class="text-end text-sm whitespace-nowrap">
                {{ item.durationVersions[0].duration | humanizeDuration }}
              </span>
						</div>
					</label>
				</li>
			</ul>

<!--			<ng-container>-->

<!--				<hr class="my-2 dark:border-beeDarkColor-700" *ngIf="index > 0">-->

<!--				<div class="flex flex-col gap-3 dark:text-white">-->

<!--					<div class="grid md:grid-cols-16 gap-4">-->
<!--						<div class="col-span-3 pt-1">-->
<!--							<ng-container *ngIf="item?.presentation?.banners?.length; else DefaultServiceImageTemplate">-->
<!--								<img-->
<!--									bocMedia-->
<!--									[src]="item.presentation.banners[0]"-->
<!--									twHeight="h-[90px]"-->
<!--									twWidth="w-[90px]"-->
<!--									class="hidden w-[90px] h-[90px] rounded-2xl object-cover"-->
<!--									alt="Image of service">-->
<!--							</ng-container>-->
<!--							<ng-template #DefaultServiceImageTemplate>-->
<!--								<div class="w-[90px] h-[90px] bg-beeColor-300 rounded-2xl"></div>-->
<!--							</ng-template>-->
<!--						</div>-->
<!--						<div class="col-span-10 flex flex-col gap-2">-->
<!--							<div class="flex flex-col gap-2">-->
<!--              <span class="font-bold">-->
<!--                {{ item.languageVersions[0].title }}-->
<!--              </span>-->
<!--								<span class="text-sm text-beeColor-500">-->
<!--                {{ item.languageVersions[0].description }}-->
<!--              </span>-->
<!--							</div>-->
<!--						</div>-->
<!--						<div class="col-span-3 flex flex-col gap-3">-->

<!--							<button-->
<!--								*ngIf="isSelected(item)"-->
<!--								(click)="deselect(item)"-->
<!--								class="text-sm flex justify-between gap-2 w-full border border-green-200 bg-green-50 text-green-600 dark:bg-green-900/50 dark:border-green-900 px-2.5 py-1 rounded-2xl">-->
<!--								<i class="bi bi-check-circle"></i>-->
<!--								{{ 'keyword.capitalize.selected' | translate }}-->
<!--							</button>-->
<!--							<button-->
<!--								*ngIf="isNotSelected(item)"-->
<!--								(click)="select(item)"-->
<!--								class="text-sm flex justify-between gap-2 w-full border border-blue-200 bg-blue-50 text-blue-600 dark:text-blue-300 dark:bg-blue-900/50 dark:border-blue-900 px-2.5 py-1 rounded-2xl">-->
<!--								<i class="bi bi-circle"></i>-->
<!--								{{ 'keyword.capitalize.select' | translate }}-->
<!--							</button>-->


<!--							<div class="flex flex-col items-center">-->
<!--                <span class="text-end text-sm">-->
<!--                {{ item.durationVersions[0].prices[0].price | currency: item.durationVersions[0].prices[0].currency: 'symbol-narrow' }}-->
<!--              </span>-->
<!--								<span class="text-end text-sm">-->
<!--                {{ item.durationVersions[0].duration | humanizeDuration }}-->
<!--              </span>-->
<!--							</div>-->
<!--						</div>-->
<!--					</div>-->

<!--				</div>-->

<!--			</ng-container>-->

		</div>
		<utility-loader *ngIf="modalSelectServiceListAdapter.loading$.isOn"/>
	`
})
export class ModalSelectServiceComponent implements OnInit {

	public readonly modalSelectServiceListAdapter = inject(ModalSelectServiceListAdapter);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);

	public selectedServiceList: IService[] = [];
	public newSelectedServiceList: IService[] = [];

	public multiple = true;

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

}
