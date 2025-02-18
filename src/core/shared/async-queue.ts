export class AsyncQueue {
	private queue: (() => Promise<void>)[] = [];
	private isProcessing = false;

	/**
	 * Add async task to queue
	 * @param task
	 */
	public async enqueue(task: () => Promise<void>): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.queue.push(async () => {
				try {
					await task();
					resolve();
				} catch (error) {
					reject(error);
				}
			});

			if (!this.isProcessing) {
				this.processQueue();
			}
		});
	}

	/**
	 * Process queue
	 * @private
	 */
	private async processQueue(): Promise<void> {
		if (this.isProcessing) return;
		this.isProcessing = true;

		while (this.queue.length > 0) {
			const task = this.queue.shift();
			if (task) {
				await task();
			}
		}

		this.isProcessing = false;
	}
}
