import {inject, Injectable} from "@angular/core";
import {
	CustomerIndexedDBCollectionManager
} from "@customer/infrastructure/manager/customer.indexedDB.collection.manager";

@Injectable()
export class CustomerIndexedDBFacade {

	private readonly customerIndexedDBCollectionManager = inject(CustomerIndexedDBCollectionManager);

	public readonly source = this.customerIndexedDBCollectionManager.context.database;

}
