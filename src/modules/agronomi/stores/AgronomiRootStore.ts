import { configure } from "mobx";
import { createContext } from "react";
import PasStore from "./PasStore";

configure({ enforceActions: 'always' });

export class AgronomiRootStore {
    pasStore: PasStore;

    constructor() {
        this.pasStore = new PasStore(this);
    }
}

export const AgronomiRootStoreContext = createContext(new AgronomiRootStore());
