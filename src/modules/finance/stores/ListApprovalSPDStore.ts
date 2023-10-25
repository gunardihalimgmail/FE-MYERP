import { action, runInAction, observable } from "mobx";
import agent from "../api/agent";
import { FinanceRootStore } from "./FinanceRootStore";

export default class ListApprovalSPDStore {
    financeRootStore: FinanceRootStore;

    constructor(financeRootStore: FinanceRootStore) {
        this.financeRootStore = financeRootStore;
    }
    // [Route("getlistdokumen/{id_ms_login}/{pt}/{keyword}/{startdate}/{enddate}")]    
    @action getDataHistorySPD = async (id_ms_login: number, pt: any[], keyword: string,
        startdate: string, enddate: string) => {
        try {
            let param = {
                id_ms_login,
                PT: pt,
                Keyword: keyword,
                StartDate: startdate,
                EndDate: enddate
            }
            // const response = await agent.ListHistorySPD.getListSPDHistory(id_ms_login, pt, keyword, startdate, enddate);
            const response = await agent.ListHistorySPD.getListSPDHistory(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataHistorySPDDetail = async (id: number) => {
        try {
            const response = await agent.ListHistorySPD.getListSPDHistoryDetail(id);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
