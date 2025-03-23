import {inject, Provider} from '@angular/core';
import {AbsenceRepository} from '@absence/infrastructure/repository/absence.repository';
import {AbsenceIndexedDBDataProvider} from '@absence/infrastructure/data-provider/indexedDB/absence.indexedDB.data-provider';

export class AbsenceRepositoryFactory {
    create(): AbsenceRepository {
        const dataProvider = inject(AbsenceIndexedDBDataProvider);
        const repository = new AbsenceRepository();
        repository.setDataProvider(dataProvider);
        return repository;
    }
    public static provide(): Provider {
        return {
            provide: AbsenceRepository,
            useFactory: (factory: AbsenceRepositoryFactory) => factory.create(),
            deps: [AbsenceRepositoryFactory],
        };
    }
} 