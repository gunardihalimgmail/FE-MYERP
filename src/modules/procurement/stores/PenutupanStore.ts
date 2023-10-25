import { ProcurementRootStore } from "./ProcurementRootStore";
import { action } from "mobx";
import agent from "../api/agent";

export default class PenutupanStore {
    procurementRootStore: ProcurementRootStore;

    constructor(procurementRootStore: ProcurementRootStore) {
        this.procurementRootStore = procurementRootStore;
    }

    @action getDataPenutupan = async (id_ms_login: any) => {
        try {
            const response = await agent.Penutupan.getPenutupanList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataPenutupanDetail = async (param: any) => {
        try {
            const response = await agent.Penutupan.getDataPenutupanDetailList(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action approvalPenutupan = async (param: any) => {
        try {
            const response = await agent.Penutupan.approvePenutupan(param);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
