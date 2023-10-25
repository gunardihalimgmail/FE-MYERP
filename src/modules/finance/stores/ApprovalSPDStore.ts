
import { action, runInAction, observable } from "mobx";
import agent from "../api/agent";
import { FinanceRootStore } from "./FinanceRootStore";

export default class ApprovalBKUStore {
    financeRootStore: FinanceRootStore;

    constructor(financeRootStore: FinanceRootStore) {
        this.financeRootStore = financeRootStore;
    }

    @action getDataSPDKirim = async (id_ms_login: any) => {
        try {
            const response = await agent.ApprovalSPD.getSPDKirimList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataSPDTerima = async (id_ms_login: any) => {
        try {
            const response = await agent.ApprovalSPD.getSPDTerimaList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataSPDKirimNotTerima = async (id_ms_login: any) => {
        try {
            const response = await agent.ApprovalSPD.getSPDKirimNotTerimaList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataOpsiTujuanEST = async (bagian: any) => {
        try {
            const response = await agent.ApprovalSPD.getDataOpsiTujuanESTList(bagian);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataOpsiTujuanJKT = async (bagian: any) => {
        try {
            const response = await agent.ApprovalSPD.getDataOpsiTujuanJKTList(bagian);
            return response;
        } catch (error) {
            throw error;
        }
    }

    
    @action kirimDocSpd = async (param: any) => {
        try {
            const response = await agent.ApprovalSPD.kirimSpd(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action tolakDocSpd = async (param: any) => {
        try {
            const response = await agent.ApprovalSPD.tolakSpd(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action terimaDocSpd = async (param: any) => {
        try {
            const response = await agent.ApprovalSPD.terimaSpd(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDirNotes = async (nomor: any) => {
        try {
            const response = await agent.ApprovalSPD.getDirNotesList(nomor);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataSPDDitolak = async (id_ms_login: any) => {
        try {
            const response = await agent.ApprovalSPD.getSPDDitolakList(Number(id_ms_login));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDokFlowStatusSpd = async (jenis: string, nomor: string) => {
        try {
            const response = await agent.ApprovalSPD.getDokFlowStatusList(jenis, nomor);
            return response;
        } catch (error) {
            throw error;
        }
    }


    // @action kirimDocSpdHO = async (param: any) => {
    //     try {
    //         const response = await agent.ApprovalSPD.kirimSpdHO(param);
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // }


    // @action kirimDocSpdEST = async (param: any) => {
    //     try {
    //         const response = await agent.ApprovalSPD.kirimSpdEST(param);
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @action saveComment = async (param: any) => {
    //     try {
    //         const response = await agent.ApprovalSPD.saveCommentSpd(param);
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // @action updateDitujukan = async (param: any) => {
    //     try {
    //         const response = await agent.ApprovalSPD.updateDitujukan(param);
    //         return response;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

}
