import {formatTime, reverseFormatTime} from "@utility/domain/time";

describe('formatTime', () => {
  it('should format time correctly for 0 seconds', () => {
    const timeInSeconds = 0;
    const formattedTime = formatTime(timeInSeconds);
    expect(formattedTime).toBe('00:00:00');
  });

  it('should format time correctly for 3661 seconds', () => {
    const timeInSeconds = 3661;
    const formattedTime = formatTime(timeInSeconds);
    expect(formattedTime).toBe('01:01:01');
  });

  it('should format time correctly for 7200 seconds', () => {
    const timeInSeconds = 7200;
    const formattedTime = formatTime(timeInSeconds);
    expect(formattedTime).toBe('02:00:00');
  });

  it('should format seconds to hh:mm:ss', () => {
    expect(formatTime(3661, 'seconds')).toBe('01:01:01');
  });

  it('should format minutes to hh:mm:ss', () => {
    expect(formatTime(90, 'minutes')).toBe('01:30:00');
  });

  it('should format hours to hh:mm:ss', () => {
    expect(formatTime(3.5, 'hours')).toBe('03:30:00');
  });

  it('should throw an error for invalid time unit', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(() => formatTime(100, 'days')).toThrow('Invalid time unit: days');
  });

  it('should reverse formatted time "00:00:00" to 0 seconds', () => {
    const formattedTime = '00:00:00';
    const seconds = reverseFormatTime(formattedTime);
    expect(seconds).toBe(0);
  });

  it('should reverse formatted time "01:30:00" to 5400 seconds', () => {
    const formattedTime = '01:30:00';
    const seconds = reverseFormatTime(formattedTime);
    expect(seconds).toBe(5400);
  });

  it('should reverse formatted time "03:45:15" to 13515 seconds', () => {
    const formattedTime = '03:45:15';
    const seconds = reverseFormatTime(formattedTime);
    expect(seconds).toBe(13515);
  });

  // Add more test cases as needed
});
