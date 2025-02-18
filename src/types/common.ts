export interface OptionItem {
  value?: string | number;
  title?: string;
}

export type Variant =
  | 'primary'
  | 'success'
  | 'neutral'
  | 'warning'
  | 'danger';
