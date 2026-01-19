export type Operator = 'EQ' | 'NEQ' | 'GT' | 'GTE' | 'LT' | 'LTE' | 'CONTAINS';

export interface Condition {
  fact?: string;
  operator?: Operator;
  value?: any;
  all_of?: Condition[];
  any_of?: Condition[];
}

export interface Action {
  type: 'UPDATE_FACT' | 'SET_STATE' | 'EMIT_EVENT';
  params: {
    path?: string;
    value?: any;
    name?: string;
    [key: string]: any;
  };
}

export interface Rule {
  id: string;
  priority: number;
  description?: string;
  when: Condition;
  then: Action[];
}