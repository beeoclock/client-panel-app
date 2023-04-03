import {FirstKeyNamePipe} from './first-key-name.pipe';

describe('FirstKeyNamePipe', () => {
  it('create an instance', () => {
    const pipe = new FirstKeyNamePipe();
    expect(pipe).toBeTruthy();
  });
});
