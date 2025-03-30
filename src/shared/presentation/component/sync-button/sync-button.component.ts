import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation} from "@angular/core";
import {IsOnlineService} from "@core/cdk/is-online.service";
import {AsyncPipe, DatePipe, DecimalPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {Reactive} from "@core/cdk/reactive";
import {setIntervals$} from "@shared/domain/timer";
import {BaseSyncManager, ISyncManger} from "@core/system/infrastructure/sync-manager/base.sync-manager";
import {TimeAgoPipe} from "@shared/presentation/pipes/time-ago.pipe";
import {tap} from "rxjs";

interface SyncState {
	modulesCount: number;
	modulesSynced: number;
	progress: {
		total: number;
		current: number;
		percentage: number;
	} | null; // Null if no module is syncing
}

@Component({
	standalone: true,
	selector: 'sync-button-component',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	imports: [
		AsyncPipe,
		DatePipe,
		TranslatePipe,
		TimeAgoPipe,
		DecimalPipe
	],
	host: {
		class: 'px-3 pb-4 pt-0'
	},
	template: `

		@if (isOffline$ | async) {

			<div class="rounded-2xl border border-red-300 bg-red-100 flex flex-col">
				<button (click)="syncAll()"
						class="h-[48px] text-red-700 gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-red-200 cursor-pointer transition-all">
					<i class="bi bi-arrow-repeat text-xl"></i>
					<div class="flex flex-col items-start">
						<span class="text-xs">
							{{ 'keyword.capitalize.youOffline' | translate }}
						</span>
						<span class="text-xs">
							{{ lastSynchronizedIn | date: 'dd.MM.yyyy HH:mm:ss' }}
						</span>
					</div>
				</button>
			</div>

		} @else {

			<div class="rounded-2xl border border-neutral-300 bg-neutral-50 flex flex-col">
				@if (isSyncing$ | async) {

					<button
						(click)="pauseAll()"
						class="h-[48px] w-full gap-2 text-black p-2 px-3 rounded-2xl flex justify-start items-center group">
						<i class="animate-spin bi bi-arrow-repeat text-xl group-hover:hidden"></i>
						<i class="bi bi-pause-circle hidden group-hover:block text-xl"></i>
						<div class="flex flex-col items-start w-full">
							<span class="text-xs">
							{{ 'keyword.capitalize.syncing' | translate }}
						</span>
							<!-- Progress -->
							<div class="w-full flex items-center gap-x-3 whitespace-nowrap text-xs">
								<div>
									{{ params.modulesSynced }} / {{ params.modulesCount }}
								</div>
								<div
									class="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
									role="progressbar" [attr.aria-valuenow]="currentSyncManager?.syncState?.progress?.percentage" aria-valuemin="0" aria-valuemax="100">
									<div
										class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
										[style.width.%]="currentSyncManager?.syncState?.progress?.percentage"></div>
								</div>
								<div class="w-10 text-end">
									<span class="text-sm text-gray-800 dark:text-white">{{ currentSyncManager?.syncState?.progress?.percentage | number: '1.0-0' }}%</span>
								</div>
							</div>
							<!-- End Progress -->

						</div>
					</button>

				} @else {

					<button (click)="syncAll()"
							[title]="lastSynchronizedIn | date: 'dd.MM.yyyy HH:mm:ss'"
							class="h-[48px] text-black gap-2 p-2 px-3 rounded-2xl flex justify-start items-center hover:bg-neutral-200 cursor-pointer transition-all">
						<i class="bi bi-arrow-repeat text-xl"></i>
						<div class="flex flex-col items-start">
							<span class="text-xs">
								{{ 'keyword.capitalize.synced' | translate }}
							</span>
							<span class="text-xs">
								@if (lastSynchronizedIn) {
									{{ lastSynchronizedIn | timeAgo }}
								}
							</span>
						</div>
					</button>

				}
			</div>

		}

	`
})
export class SyncButtonComponent extends Reactive implements OnInit {

	private readonly isOnlineService = inject(IsOnlineService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public readonly isOffline$ = this.isOnlineService.isOffline$;
	public readonly isSyncing$ = BaseSyncManager.isSyncing$.pipe(
		tap(() => {
			this.resetState();
		})
	);

	public lastSynchronizedIn = new Date(0).toISOString();

	public readonly state: Map<string, 'wait' | 'done' | ISyncManger> = new Map<string, 'wait' | 'done' | ISyncManger>();
	public currentSyncManager: ISyncManger | null = null;

	public syncAll() {
		if (BaseSyncManager.isPaused$.value) {
			BaseSyncManager.resumeAll().then(() => {
				console.log('resumeAll done');
			});
			return;
		}
		BaseSyncManager.syncAll().then(() => {
			console.log('syncAll done');
		});
	}

	public pauseAll() {
		BaseSyncManager.pauseAll().then(() => {
			console.log('pauseAll done');
		});
	}

	public resetState() {
		BaseSyncManager.register.forEach((syncManger) => {
			this.state.set(syncManger.moduleName, 'wait');
		});
	}

	public get params() {
		return {
			modulesCount: this.state.size,
			modulesSynced: Array.from(this.state.values()).filter((value) => value !== 'wait').length,
		}
	}

	public ngOnInit() {

		BaseSyncManager.register.forEach((syncManger) => {
			this.state.set(syncManger.moduleName, 'wait');
		});

		setIntervals$(() => {

			BaseSyncManager.register.forEach((syncManger) => {
				if (syncManger.isSyncing) {
					this.currentSyncManager = syncManger;
				}
				const moduleState = this.state.get(syncManger.moduleName);
				if (moduleState) {
					switch (moduleState) {
						case 'wait':
							if (syncManger.isSyncing) {
								this.state.set(syncManger.moduleName, syncManger);
							}
							break;
						case 'done':
							break;
						default:
							if (!syncManger.isSyncing) {
								this.state.set(syncManger.moduleName, 'done');
							}
							break;
					}
				}
			});

			// console.log('state', this.state);

			const {syncState} = BaseSyncManager.getSyncManager('businessProfile');
			this.lastSynchronizedIn = syncState?.options?.updatedSince || new Date(0).toISOString();
			this.changeDetectorRef.detectChanges();
		}, 1_000).pipe(this.takeUntil()).subscribe();
	}


}
