interface Constraint {
  value: string | null;
  matchMode: string;
}

interface Filter {
  value: string | null;
  matchMode?: string;
  operator?: string;
  constraints?: Constraint[];
}

export default Filter;

export type { Constraint, Filter };
