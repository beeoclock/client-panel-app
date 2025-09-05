// app-if-not-platform.directive.ts
import {Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import type {OS, Runtime} from './platform.types';
import {PlatformDetectorService} from "@shared/presentation/directives/platform/platform.detector.service";

type Filter = string | { os?: OS; runtime?: Runtime };

@Directive({
	selector: '[ifNotPlatform]',
	standalone: true,
})
export class AppIfNotPlatformDirective {
	public readonly ifNotPlatform = input.required<Filter | Filter[]>();
	public readonly ifNotPlatformElse = input<TemplateRef<unknown> | null>(null);

	private hasView = false;

	public constructor(
		private readonly tpl: TemplateRef<unknown>,
		private readonly vcr: ViewContainerRef,
		private readonly platform: PlatformDetectorService
	) {
		effect(() => {
			const filters = this.normalize(this.ifNotPlatform());
			const { os, runtime } = this.platform.info();

			const matched = filters.some(f =>
				(f.os ? f.os === os : true) && (f.runtime ? f.runtime === runtime : true)
			);

			this.render(!matched); // показуємо, якщо НЕ збіглось
		});
	}

	private normalize(f: Filter | Filter[]): { os?: OS; runtime?: Runtime }[] {
		const arr = Array.isArray(f) ? f : [f];
		return arr.map(item => {
			if (typeof item === 'string') {
				const [os, runtime] = item.split(':') as [OS | undefined, Runtime | undefined];
				return { os, runtime };
			}
			return item || {};
		});
	}

	private render(show: boolean) {
		if (show && !this.hasView) {
			this.vcr.clear();
			this.vcr.createEmbeddedView(this.tpl);
			this.hasView = true;
		} else if (!show) {
			this.vcr.clear();
			const elseT = this.ifNotPlatformElse();
			if (elseT) this.vcr.createEmbeddedView(elseT);
			this.hasView = false;
		}
	}
}
