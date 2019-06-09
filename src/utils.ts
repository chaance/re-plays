/**
 * Converts value in milliseconds to a time string `HH:MM:SS`
 * If the value is not equal to at least one hour, the format should be `MM:SS`
 */
export function toTime(ms: number): string | null {
  try {
    let fmt = new Date(ms).toISOString().slice(11, -1);
    if (ms >= 8.64e7) {
      /* >= 24 hours */
      let parts = fmt.split(/:(?=\d{2}:)/);
      // @ts-ignore
      parts[0] -= -24 * ((ms / 8.64e7) | 0);
      fmt = parts.join(':');
    }
    if (fmt.includes('NaN') || fmt.includes('T')) return null; // This should filter out absurdly large numbers
    return fmt
      .split('.')[0]
      .split(':')
      .filter((t, i) => i !== 0 || t !== '00')
      .join(':');
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') console.error(e);
    return null;
  }
}
