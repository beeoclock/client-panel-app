import {createPersistenceAdapter} from '@signaldb/core'

/**
 * Creates a persistence adapter for managing a SignalDB collection using IndexedDB.
 * This adapter reads and writes data to an IndexedDB object store, with customizable serialization and deserialization.
 * @template T - The type of the items in the collection.
 * @template I - The type of the unique identifier for the items.
 * @returns A SignalDB persistence adapter for managing data in IndexedDB.
 * @param options
 */
export default function indexedDBPersistenceAdapter<
	T extends { id: I } & Record<string, any>,
	I extends IDBValidKey,
>(options: {
	databaseName: string;
	version: number;
	storeName: string;
	storeParameters: IDBObjectStoreParameters;
	indexes?: Array<{ name: string, keyPath: string, options?: IDBIndexParameters }>;
}) {

	const {databaseName, storeName, indexes, storeParameters, version} = options

	/**
	 * Opens the IndexedDB database and creates the object store if it doesn't exist.
	 * @returns A promise that resolves with the opened database.
	 */
	function openDatabase(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(databaseName, version);
			request.addEventListener('upgradeneeded', () => {
				const database = request.result
				if (!database.objectStoreNames.contains(storeName)) {
					const store = database.createObjectStore(storeName, storeParameters);
					indexes?.forEach(index => store.createIndex(index.name, index.keyPath, index.options))
				}
			});
			request.addEventListener('success', () => resolve(request.result));
			request.addEventListener('error', () => reject(new Error(request.error?.message || 'Database error')));
		})
	}

	/**
	 * Retrieves all items from the IndexedDB object store.
	 * @returns A promise that resolves with an array of items.
	 */
	async function getAllItems(): Promise<T[]> {
		const database = await openDatabase()
		return new Promise((resolve, reject) => {
			const transaction = database.transaction(storeName, 'readonly');
			const store = transaction.objectStore(storeName);
			const request = store.getAll();
			request.addEventListener('success', () => resolve(request.result as T[]));
			request.addEventListener('error', () => reject(new Error(request.error?.message || 'Error fetching items')))
		})
	}

	return createPersistenceAdapter<T, I>({
		async load() {
			const items = await getAllItems()
			return {items}
		},
		async save(items, {added, modified, removed}) {

			console.log('SignalDB:indexedDBPersistenceAdapter:save', {
				items,
				added,
				modified,
				removed
			});

			const database = await openDatabase()
			const transaction = database.transaction(storeName, 'readwrite')
			const store = transaction.objectStore(storeName)

			added.forEach(item => store.add(item))
			modified.forEach(item => store.put(item))
			removed.forEach(item => store.delete(item.id))

			if (transaction.db.name.endsWith('customer')) {
				// debugger;
				console.log('customer');
			}

			console.log({transaction, store});

			return new Promise((resolve, reject) => {
				transaction.addEventListener('complete', () => resolve())
				transaction.addEventListener('error', () => reject(new Error(transaction.error?.message || 'Transaction error')))
			})
		},
		async register() {
			return
		},
	})
}
