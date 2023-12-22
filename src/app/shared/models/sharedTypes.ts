
import { CurrentConditions } from 'app/shared/models/current-conditions.type';
import { Action } from './constants';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
}

export interface LocationAction {
    locations: string[] | string,
    action: Action,
}
