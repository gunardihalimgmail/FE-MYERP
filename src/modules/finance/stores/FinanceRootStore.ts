import { configure } from "mobx";
import { createContext } from "react";
import ApprovalBKUStore from "./ApprovalBKUStore";
import ApprovalSPDStore from "./ApprovalSPDStore";
import LaporanVoucherStore from "./LaporanVoucherStore";
import ListApprovelSPDStore from "./ListApprovalSPDStore";

configure({ enforceActions: 'always' });

export class FinanceRootStore {
    approvalBKUStore: ApprovalBKUStore;
    approvalSPDStore: ApprovalSPDStore;
    laporanVoucherStore: LaporanVoucherStore;
    listApprovalSPDStore: ListApprovelSPDStore;

    constructor() {
        this.approvalBKUStore = new ApprovalBKUStore(this);
        this.approvalSPDStore = new ApprovalSPDStore(this);
        this.laporanVoucherStore = new LaporanVoucherStore(this);
        this.listApprovalSPDStore = new ListApprovelSPDStore(this);
    }
}

export const FinanceRootStoreContext = createContext(new FinanceRootStore());
