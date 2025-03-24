import {ChangeDetectionStrategy, Component, computed, inject, input, output} from "@angular/core";
import {Router} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {StateEnum} from "@core/shared/enum/state.enum";
import {IonContent, IonItem, IonLabel, IonList, IonPopover} from "@ionic/angular/standalone";
import ObjectID from "bson-objectid";

@Component({
	selector: 'utility-table-column-action',
	standalone: true,
	imports: [
		TranslateModule,
		IonPopover,
		IonContent,
		IonList,
		IonItem,
		IonLabel,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [
		`
			:host {
				.button {
					@apply
					text-beeColor-800
					dark:text-beeDarkColor-100
					border-beeColor-200
					border
					hover:bg-beeColor-300
					focus:outline-none
					font-medium
					rounded-2xl
					text-sm
					px-3
					py-2
					text-center
					inline-flex
					items-center
					dark:bg-beeDarkColor-600
					dark:hover:bg-beeDarkColor-700
				}
			}
		`
	],
	template: `

		<button class="button"
				[id]="'click-trigger' + buttonId()"
				(click)="$event.stopPropagation();"
				type="button">
			<i class="bi bi-three-dots-vertical"></i>
		</button>
		<ion-popover #popover [trigger]="'click-trigger' + buttonId()" side="left" triggerAction="click">
			<ng-template>
				<ion-content>

					<ion-list>

						@if (!hide().includes('details')) {

							<ion-item button lines="full" (click)="open.emit(id()); popover.dismiss()">
								<ion-label>
									<i class="bi bi-eye"></i>
									{{ 'keyword.capitalize.details' | translate }}
								</ion-label>
							</ion-item>
						}
						@if (!hide().includes('edit')) {
							<ion-item button lines="full" (click)="edit.emit(id()); popover.dismiss()">
								<ion-label>
									<i class="bi bi-pencil"></i>
									{{ 'keyword.capitalize.edit' | translate }}
								</ion-label>
							</ion-item>
						}
						<ng-content/>
						@if (!hide().includes('delete')) {
							<ion-item button lines="full" (click)="delete.emit(id()); popover.dismiss()">
								<ion-label>
									<i class="bi bi-trash"></i>
									{{ 'keyword.capitalize.delete' | translate }}
								</ion-label>
							</ion-item>
						}
						@if (!hide().includes('activate')) {
							@if (state() !== stateEnum.active) {
								<ion-item button lines="full" (click)="activate.emit(id()); popover.dismiss()">
									<ion-label>
										<i class="bi bi-toggle-on"></i>
										{{ 'keyword.capitalize.activate' | translate }}
									</ion-label>
								</ion-item>
							}
						}
						@if (!hide().includes('deactivate')) {
							@if (state() === stateEnum.active) {
								<ion-item button lines="full" (click)="deactivate.emit(id()); popover.dismiss()">
									<ion-label>
										<i class="bi bi-toggle-off"></i>
										{{ 'keyword.capitalize.deactivate' | translate }}
									</ion-label>
								</ion-item>
							}
						}
					</ion-list>

				</ion-content>
			</ng-template>
		</ion-popover>

	`
})
export class ActionComponent {

	public readonly hide = input<('details' | 'edit' | 'delete' | 'activate' | 'deactivate')[]>([]);

	public readonly prefix = input<string>(new ObjectID().toHexString());

	public readonly id = input.required<string>();

	public readonly buttonId = computed(() => this.prefix() + '_' + this.id());

	public readonly state = input<StateEnum>(StateEnum.active);

	public readonly edit = output<string>();

	public readonly open = output<string>();

	public readonly delete = output<string>();

	public readonly activate = output<string>();
	public readonly deactivate = output<string>();
	public readonly archive = output<string>();

	private readonly router = inject(Router);

	public readonly returnUrl = this.router.url;

	public readonly stateEnum = StateEnum;

}
