import { toTime } from '../src/utils';

describe('utils', () => {
  describe('toTime', () => {
    it('converts a numeric value in milliseconds to the appropriate time string', () => {
      expect(toTime(0)).toBe('00:00');
      expect(toTime(5000)).toBe('00:05');
      expect(toTime(6000 * 100)).toBe('10:00');
      expect(toTime(3600099)).toBe('01:00:00');
      expect(toTime(3605050)).toBe('01:00:05');
      expect(toTime(3625090)).toBe('01:00:25');
      expect(toTime(7200000 + 2100050)).toBe('02:35:00');
      expect(toTime(8.64e7)).toBe('24:00:00');
      expect(toTime(6969696969696969)).toBe(null);
      expect(toTime(6969696969696969 * 100)).toBe(null);
    });
  });
});
