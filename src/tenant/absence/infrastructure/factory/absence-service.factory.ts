import {inject, Provider} from '@angular/core';
import {AbsenceService} from '@tenant/absence/domain/service/absence.service';
import {AbsenceRepository} from '@tenant/absence/infrastructure/repository/absence.repository';

export class AbsenceServiceFactory {
    public static provide(): Provider {
        return {
            provide: AbsenceService,
            useFactory: () => {
                const repository = inject(AbsenceRepository);
                const service = new AbsenceService();
                service.repository = repository;
                service.initDbHandler();
                return service;
            },
        };
    }
}
