import { configure } from "mobx";
import { createContext } from "react";
import PengajuanGradeStore from "./PengajuanGradeStore";

configure({ enforceActions: "always" });

export class HRRootStore {
    pengajuanGradeStore: PengajuanGradeStore;

    constructor() {
        this.pengajuanGradeStore = new PengajuanGradeStore(this);
    }
}

export const HRRootStoreContext = createContext(new HRRootStore());
