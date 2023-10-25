import { configure } from "mobx";
import { createContext } from "react";
import ApprovalOPStore from "./ApprovalOPStore";
import ApprovalTTISStore from "./ApprovalTTISStore";
import PenutupanStore from "./PenutupanStore";
import ListOPStore from "./ListOPStore";

configure({ enforceActions: 'always' });

export class ProcurementRootStore {
    approvalOPStore: ApprovalOPStore;
    penutupanStore: PenutupanStore;
    approvalTTISStore: ApprovalTTISStore;
    listOPStore: ListOPStore;

    constructor() {
        this.approvalOPStore = new ApprovalOPStore(this);
        this.penutupanStore = new PenutupanStore(this);
        this.approvalTTISStore = new ApprovalTTISStore(this);
        this.listOPStore = new ListOPStore(this);
    }
}

export const ProcurementRootStoreContext = createContext(new ProcurementRootStore());
