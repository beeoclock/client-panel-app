import {Type} from '@angular/core';

export type WhacAMoleBuildItArgsType = {
	component: Type<unknown>;
	componentInputs?: Record<string, unknown>;
	title?: string;
	showLoading?: boolean;
	id?: string;
	button?: {
		close?: {
			classList?: string[];
			title?: string;
			useDefaultIcon?: boolean;
			text?: string;
			callback?: () => void;
		};
	};
	callback?: {
		on?: {
			destroy?: {
				before?: () => void;
				after?: () => void;
			};
			update?: {
				before?: (componentInputs: Record<string, unknown> | undefined) => void;
				after?: (componentInputs: Record<string, unknown> | undefined) => void;
			};
		};
	};
};
