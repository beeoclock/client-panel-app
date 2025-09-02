import {Directive, effect, input, TemplateRef, ViewContainerRef} from '@angular/core';
import type {OS, Runtime} from './platform.types';
import {PlatformDetectorService} from "@shared/presentation/directives/platform/platform.detector.service";

// 🇺🇦 Підтримує рядок "ios:pwa", "android:web", або { os, runtime }, або масив
type Filter = string | { os?: OS; runtime?: Runtime };

@Directive({
	selector: '[ifPlatform]',
	standalone: true,
})
export class AppIfPlatformDirective {
	public readonly ifPlatform = input.required<Filter | Filter[]>();
	public readonly ifPlatformElse = input<TemplateRef<unknown> | null>(null);

	private hasView = false;

	public constructor(
		private readonly tpl: TemplateRef<unknown>,
		private readonly vcr: ViewContainerRef,
		private readonly platform: PlatformDetectorService
	) {
		effect(() => {
			const filters = this.normalize(this.ifPlatform());
			const { os, runtime } = this.platform.info();
			const show = filters.some(f =>
				(f.os ? f.os === os : true) && (f.runtime ? f.runtime === runtime : true)
			);
			this.render(show);
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
			const elseT = this.ifPlatformElse();
			if (elseT) this.vcr.createEmbeddedView(elseT);
			this.hasView = false;
		}
	}
}
