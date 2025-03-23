import {inject, Provider} from '@angular/core';
import {PushChangesSyncManager} from '@absence/infrastructure/sync-manager/push.changes.sync-manager';
import {AbsenceIndexedDBDataProvider} from '@absence/infrastructure/data-provider/indexedDB/absence.indexedDB.data-provider';

export class PushChangesSyncManagerFactory {
    public static provide(): Provider {
        return {
            provide: PushChangesSyncManager,
            useFactory: () => {
                return new PushChangesSyncManager(
                    inject(AbsenceIndexedDBDataProvider)
                );
            },
        };
    }
} 