import {ChangeDetectionStrategy, Component, input, ViewEncapsulation} from "@angular/core";
import {DatePipe, NgTemplateOutlet} from "@angular/common";
import {IonicModule} from "@ionic/angular";
import {is} from "@core/shared/checker";

@Component({
	selector: 'synchronization-molecule',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		DatePipe,
		IonicModule,
		NgTemplateOutlet
	],
	template: `

		@if (isNew()) {

			@if (isErrorList()) {
				<ng-container *ngTemplateOutlet="errorListTemplate"/>
			} @else {


				<div>
					<span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
						Waiting for sync
					</span>
				</div>


			}


		} @else {


			@if (isErrorList()) {


				<ng-container *ngTemplateOutlet="errorListTemplate"/>


			} @else {


				<span
					class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800/30 dark:text-teal-500">
					<i class="bi bi-patch-check"></i>
					{{ item().syncedAt | date: 'short' }}
				</span>


			}


		}

		<ng-template #errorListTemplate>

			<div>
			  <span
				  [id]="item()._id + '-errors'" (click)="$event.stopPropagation()"
				  class="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
				<svg class="shrink-0 size-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
					 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
				  <path d="M12 9v4"></path>
				  <path d="M12 17h.01"></path>
				</svg>
				Attention
			  </span>
			</div>

			<ion-popover [trigger]="item()._id + '-errors'" triggerAction="click">
				<ng-template>
					<ion-content class="ion-padding">
						<ion-list>
							@if (isErrorList()) {


								@for (error of item().errors; track error.message) {


									<ion-item lines="full">
										<ion-label>
											{{ error.message }}
										</ion-label>
									</ion-item>

								}

							}
						</ion-list>
					</ion-content>
				</ng-template>
			</ion-popover>
		</ng-template>
	`
})
export class SynchronizationMolecule {

	public readonly item = input.required<
		{
			_id: string;
			syncedAt?: string;
			errors?: {
				fromSource: 'server' | 'client';
				message: string;
				code?: number;
			}[];
		}>();

	public isErrorList(): boolean {
		return is.array_not_empty(this.item().errors);
	}

	public isNew(): boolean {
		return this.item()?.syncedAt === undefined;
	}

}
