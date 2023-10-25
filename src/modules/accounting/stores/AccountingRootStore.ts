import { configure } from "mobx";
import { createContext } from "react";
import BKUAccountingStore from "./BKUAccountingStore";

configure({ enforceActions: 'always' });

export class AccountingRootStore {
    bkuAccountingStore: BKUAccountingStore;

    constructor() {
        this.bkuAccountingStore = new BKUAccountingStore(this);
    }
}

export const AccountingRootStoreContext = createContext(new AccountingRootStore());
