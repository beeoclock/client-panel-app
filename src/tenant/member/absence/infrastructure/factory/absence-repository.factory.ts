import {inject, Provider} from '@angular/core';
import {AbsenceRepository} from '@tenant/member/absence/infrastructure/repository/absence.repository';
import {
	AbsenceIndexedDBDataProvider
} from '@tenant/member/absence/infrastructure/data-provider/indexedDB/absence.indexedDB.data-provider';

export class AbsenceRepositoryFactory {
    public static provide(): Provider {
        return {
            provide: AbsenceRepository,
            useFactory: () => {
                const dataProvider = inject(AbsenceIndexedDBDataProvider);
                const repository = new AbsenceRepository();
                repository.setDataProvider(dataProvider);
                return repository;
            },
        };
    }
}
