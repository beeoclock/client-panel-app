import {Type} from '@angular/core';

export type WhacAMoleBuildItArgsType = {
  component: Type<unknown>;
  componentInputs?: Record<string, unknown>;
  title?: string;
  showLoading?: boolean;
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
    };
  };
};
