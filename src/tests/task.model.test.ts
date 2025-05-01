import { Task } from '../models/task.model';

describe('Task Model', () => {
  it('should be invalid if title is empty', async () => {
    const task = new Task(); // This will not have a title
    try {
      await task.validate(); // Use async/await instead of callback
    } catch (err: any) {
      expect(err.errors.title).toBeDefined();
    }
  });
});
