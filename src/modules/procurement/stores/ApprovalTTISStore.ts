import { ProcurementRootStore } from "./ProcurementRootStore";
import { action } from "mobx";
import agent from "../api/agent";

export default class ApprovalTTISStore {
    procurementRootStore: ProcurementRootStore;

    constructor(procurementRootStore: ProcurementRootStore) {
        this.procurementRootStore = procurementRootStore;
    }

    @action getOutstandingTTIS = async (id_ms_login: any) => {
        try {
            const response = await agent.ApprovalTTIS.getOsTTISList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDetailTTIS = async (id_ps_ttis: any) => {
        try {
            const response = await agent.ApprovalTTIS.getDtlTTISList(id_ps_ttis);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getHstOPTTIS = async (id_ps_ttis: any) => {
        try {
            const response = agent.ApprovalTTIS.getHstOPTTISList(id_ps_ttis);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getHstLPBTTIS = async (id_ps_ttis: any) => {
        try {
            const response = agent.ApprovalTTIS.getHstLPBTTISList(id_ps_ttis);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action approveTTIS = async (param: any) => {
        try {
            const response = await agent.ApprovalTTIS.approveTTIS(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action approveMultipleTTIS = async (param: any) => {
        try {
            const response = await agent.ApprovalTTIS.approveMultipleTTIS(param);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
}
