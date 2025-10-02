import { isToday, getMinutes } from '../src/utils/dateUtils';
describe('dateUtils', () => {
  it('isToday detects today', () => {
    const todayStr = new Date().toISOString();
    expect(isToday(todayStr)).toBe(true);
  });
  it('getMinutes computes differences', () => {
    expect(getMinutes('10:00:00', '10:30:00')).toBe(30);
  });
});
