import { configure } from "mobx";
import { createContext } from "react";
import PenjualanUnitStore from "./PenjualanUnitStore";

configure({ enforceActions: "always" });

export class MarketingRootStore {
    penjualanUnitStore: PenjualanUnitStore;

    constructor() {
        this.penjualanUnitStore = new PenjualanUnitStore(this);
    }
}

export const MarketingRootStoreContext = createContext(new MarketingRootStore());
