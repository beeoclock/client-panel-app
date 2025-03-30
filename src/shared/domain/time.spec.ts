import {extractSecondsFrom_hh_mm_ss, secondsTo_hh_mm_ss} from "@shared/domain/time";

describe('formatTime', () => {
  it('should format time correctly for 0 seconds', () => {
    const timeInSeconds = 0;
    const formattedTime = secondsTo_hh_mm_ss(timeInSeconds);
    expect(formattedTime).toBe('00:00:00');
  });

  it('should format time correctly for 3661 seconds', () => {
    const timeInSeconds = 3661;
    const formattedTime = secondsTo_hh_mm_ss(timeInSeconds);
    expect(formattedTime).toBe('01:01:01');
  });

  it('should format time correctly for 7200 seconds', () => {
    const timeInSeconds = 7200;
    const formattedTime = secondsTo_hh_mm_ss(timeInSeconds);
    expect(formattedTime).toBe('02:00:00');
  });

  it('should format seconds to hh:mm:ss', () => {
    expect(secondsTo_hh_mm_ss(3661)).toBe('01:01:01');
  });

  it('should reverse formatted time "00:00:00" to 0 seconds', () => {
    const formattedTime = '00:00:00';
    const seconds = extractSecondsFrom_hh_mm_ss(formattedTime);
    expect(seconds).toBe(0);
  });

  it('should reverse formatted time "01:30:00" to 5400 seconds', () => {
    const formattedTime = '01:30:00';
    const seconds = extractSecondsFrom_hh_mm_ss(formattedTime);
    expect(seconds).toBe(5400);
  });

  it('should reverse formatted time "03:45:15" to 13515 seconds', () => {
    const formattedTime = '03:45:15';
    const seconds = extractSecondsFrom_hh_mm_ss(formattedTime);
    expect(seconds).toBe(13515);
  });

  // Add more test cases as needed
});
