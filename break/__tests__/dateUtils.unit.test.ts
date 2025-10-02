import { isToday, getMinutes, isThisWeek } from '../src/utils/dateUtils';
describe('dateUtils', () => {
  it('isToday detects today', () => {
    const todayStr = new Date().toISOString();
    expect(isToday(todayStr)).toBe(true);
  });
  it('getMinutes computes differences', () => {
    expect(getMinutes('10:00:00', '10:30:00')).toBe(30);
  });
  it('getMinutes returns 0 when end is missing', () => {
    expect(getMinutes('10:00:00')).toBe(0);
  });
  it('getMinutes supports seconds and crossing hours', () => {
    expect(getMinutes('09:59:30', '10:00:30')).toBe(1);
  });
  it('isThisWeek recognizes a date from this week', () => {
    const now = new Date();
    const inWeek = new Date(now);
    inWeek.setDate(now.getDate() - now.getDay() + 2); // Tuesday of this week
    expect(isThisWeek(inWeek.toISOString())).toBe(true);
  });
});
