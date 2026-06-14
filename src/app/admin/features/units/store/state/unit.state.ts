import { Unit } from '../../interfaces/unit.interfaces';

export interface UnitState {
  loading: boolean;
  data: Unit[];
  error: string | null;
}

export const initialUnitState: UnitState = {
  loading: false,
  data: [],
  error: null,
};
