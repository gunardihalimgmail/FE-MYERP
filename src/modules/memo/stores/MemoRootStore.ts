import { configure } from "mobx";
import { createContext } from "react";
import MemoStore from "./MemoStore";

configure({ enforceActions: 'always' });

export class MemoRootStore {
    memoStore: MemoStore;

    constructor() {
        this.memoStore = new MemoStore(this);
    }
}

export const MemoRootStoreContext = createContext(new MemoRootStore());
