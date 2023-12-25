
import { CurrentConditions } from 'app/shared/models/current-conditions.type';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
}
