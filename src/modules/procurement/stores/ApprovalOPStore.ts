import { ProcurementRootStore } from "./ProcurementRootStore";
import { action } from "mobx";
import agent from "../api/agent";

export default class ApprovalOPStore {
    procurementRootStore: ProcurementRootStore;

    constructor(procurementRootStore: ProcurementRootStore) {
        this.procurementRootStore = procurementRootStore;
    }

    @action getDataOP = async (id_ms_login: any) => {
        try {
            const response = await agent.ApprovalOP.getOPList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataCountProcurement = async (param: any) => {
        try {
            const response = await agent.ApprovalOP.getDataListCount(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataOPDetailCompare = (param: any) => {
        try {
            const response = agent.ApprovalOP.getDataOPDetailCompareList(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action approvalOP = async (param: any) => {
        try {
            const response = await agent.ApprovalOP.approveOP(param);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
