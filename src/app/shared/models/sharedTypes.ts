
import { CurrentConditions } from 'app/shared/models/current-conditions.type';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
}

export interface TabTitle {
    title: string,
    subtitle?: string
    metadata?: string;
}
