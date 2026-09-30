import { describeYear } from '../src/features/calendar-engine/month-grid';

const year = Number(process.argv[2] ?? 2027);
console.log(describeYear(year));
