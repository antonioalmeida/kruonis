import { Stat } from './internal';

export class Count implements Stat {

    calculate(values: Array<number>): number {
        return values.length;
    }
}