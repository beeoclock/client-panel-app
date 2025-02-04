export interface IPrepaymentPolicy {
  isRequired?: boolean;
  isPercentage?: boolean;
  value?: string;
  minimalCancelTime?: string;
}

export type RIPrepaymentPolicy = Required<IPrepaymentPolicy>;
