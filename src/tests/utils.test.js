import formatUpVotes from '../utils/formatUpVotes';
import formartUpVotes from '../utils/formatUpVotes';
describe('Format up votes utility', () => {
  test('Leaves numbers less than a thousand the same', () => {
    expect(formatUpVotes(999)).toBe('999');
  });
  test('Rounds thousands and adds k', () => {
    expect(formatUpVotes(1000)).toBe('1k');
  });
  test('Thousands have only a single decimal', () => {
    expect(formatUpVotes(1111)).toBe('1.1k');
  });
  test('Rounds millions and adds m', () => {
    expect(formatUpVotes(1000000)).toBe('1m');
  });
  test('Millions have only a single decimal', () => {
    expect(formatUpVotes(1234567)).toBe('1.2m');
  });
});
