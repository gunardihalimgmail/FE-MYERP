
import { action, runInAction, observable } from "mobx";
import { AgronomiRootStore } from "./AgronomiRootStore";
import agent from "../api/agent";

export default class PasStore {
    agronomiRootStore: AgronomiRootStore;

    constructor(agronomiRootStore: AgronomiRootStore) {
        this.agronomiRootStore = agronomiRootStore;
    }

    @action getDataPeriode = async (id_ms_login: any) => {
        try {
            const response = await agent.PasData.getPasList(id_ms_login);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDetailPAS = async (id_ag_pas: any, id_ms_login: any) => {
        try {
            const response = await agent.PasData.getDetailPasList(Number(id_ag_pas), id_ms_login);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getHeaderPAS = async (id_ag_pas: any) => {
        try {
            const response = await agent.PasData.getDetailHeaderPas(Number(id_ag_pas));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getRealisasiPAS = async (id_ag_pas: any) => {
        try {
            const response = await agent.PasData.getDetailRealisasiPasList(Number(id_ag_pas));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action updateComment = async (param: any) => {
        try {
            const response = await agent.PasData.postUpdateComment(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action deleteFile = async (param: any) => {
        try {
            const response = await agent.PasData.postDeleteFile(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action uploadFile = async (param: any) => {
        try {
            const response = await agent.PasData.postUploadFile(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDescAttach = async (id_ag_pas: any) => {
        try {
            const response = await agent.PasData.getDescAttachPasList(Number(id_ag_pas));
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getPeriodeList = async () => {
        try {
            const response = await agent.PasData.getPeriodeListPas();
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getOpsiPtList = async () => {
        try {
            const response = await agent.PasData.getOpsiPtListpas();
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getMingguList = async (IdPengaturanPeriode: any) => {
        try {
            const response = await agent.PasData.getMingguListpas(IdPengaturanPeriode);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getHistoryList = async (param: any) => {
        try {
            const response = await agent.PasData.postGetHistoryPasList(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    
}
