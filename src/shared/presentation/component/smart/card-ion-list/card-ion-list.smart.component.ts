import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	effect,
	inject,
	input,
	OnInit,
	signal,
	TemplateRef,
	ViewEncapsulation
} from "@angular/core";
import {
	InfiniteScrollCustomEvent,
	IonContent,
	IonInfiniteScroll,
	IonInfiniteScrollContent,
	IonList
} from "@ionic/angular/standalone";
import {TranslatePipe} from "@ngx-translate/core";
import {
	TableNgxDatatableSmartResource
} from "@shared/presentation/component/smart/table-ngx-datatable/table-ngx-datatable.smart.resource";
import {IAbsence} from "@tenant/absence/domain/interface/i.absence";
import {NgTemplateOutlet} from "@angular/common";

@Component({
	standalone: true,
	selector: 'card-ion-list-smart-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		IonContent,
		IonInfiniteScroll,
		IonInfiniteScrollContent,
		IonList,
		TranslatePipe,
		NgTemplateOutlet
	],
	template: `

		@if (rows.length > 0) {

			<div class="flex flex-col divide-y divide-neutral-200 h-full">
				<ion-content>
					<ion-list [classList]="ionListClassList()">
						@for (row of rows; track row?._id; ) {

							@if (row; as item) {

								<ng-container
									*ngTemplateOutlet="itemTemplate(); context: { item, index: $index }"></ng-container>

							}

						}

						@if (isLastPage()) {


							<div class="flex h-20 items-center justify-center text-beeColor-500 text-center w-full">
								{{ 'pagination.message.allDataDownloaded' | translate }}
							</div>


						}
					</ion-list>
					<ion-infinite-scroll (ionInfinite)="onIonInfinite($event)">
						<ion-infinite-scroll-content/>
					</ion-infinite-scroll>
				</ion-content>
			</div>
		} @else {

			<ng-content select="not-found-table-data-component"/>

		}

	`
})
export class CardIonListSmartComponent implements OnInit {

	public readonly ionListClassList = input<string[]>([]);

	public readonly itemTemplate = input.required<TemplateRef<any>>();

	public readonly tableNgxDatatableSmartResource = inject(TableNgxDatatableSmartResource);
	public readonly changeDetectorRef = inject(ChangeDetectorRef);

	public get rows() {
		return this.tableNgxDatatableSmartResource.rows as (IAbsence.EntityRaw | undefined)[];
	}

	public get parameters() {
		return this.tableNgxDatatableSmartResource.parameters;
	}

	public get totalSize() {
		return this.tableNgxDatatableSmartResource.totalSize;
	}

	public get isLoading() {
		return this.tableNgxDatatableSmartResource.isLoading;
	}

	public get resource() {
		return this.tableNgxDatatableSmartResource.resource;
	}

	public readonly isLastPage = computed(() => {
		const parameters = this.parameters();
		const totalSize = this.totalSize();
		return totalSize <= (parameters.page * parameters.pageSize);
	});

	private lastInfiniteScrollCustomEvent = signal<InfiniteScrollCustomEvent | null>(null);

	public completeLastInfiniteScrollCustomEvent() {

		const isLoading = this.isLoading();
		const lastInfiniteScrollCustomEvent = this.lastInfiniteScrollCustomEvent();

		this.changeDetectorRef.detectChanges();

		if (!lastInfiniteScrollCustomEvent || isLoading) {
			return;
		}

		lastInfiniteScrollCustomEvent.target.complete().then();
		this.lastInfiniteScrollCustomEvent.set(null);

	}

	public constructor() {
		effect(() => {
			this.completeLastInfiniteScrollCustomEvent();
		})
	}

	public ngOnInit() {
		this.parameters.update((parameters) => {
			return {
				...parameters,
				page: 1,
				pageSize: 20
			}
		});
	}

	public onIonInfinite(event: InfiniteScrollCustomEvent) {

		if (this.isLastPage()) {
			event.target.complete().then();
			return;
		}

		this.lastInfiniteScrollCustomEvent.set(event);

		this.parameters.update((parameters) => {
			return {
				...parameters,
				page: parameters.page + 1,
			}
		});

	}

}
