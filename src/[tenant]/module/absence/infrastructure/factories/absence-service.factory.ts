import {inject, Provider} from '@angular/core';
import {AbsenceService} from '@core/business-logic/absence/service/absence.service';
import {AbsenceRepository} from '@absence/infrastructure/repository/absence.repository';

export class AbsenceServiceFactory {
    create(): AbsenceService {
        const repository = inject(AbsenceRepository);
        const service = new AbsenceService();
        service.repository = repository;
        service.initDbHandler();
        return service;
    }
    public static provide(): Provider {
        return {
            provide: AbsenceService,
            useFactory: (factory: AbsenceServiceFactory) => factory.create(),
            deps: [AbsenceServiceFactory],
        };
    }
} 