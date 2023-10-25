
import { action, runInAction, observable } from "mobx";
import agent from "../api/agent";
import { MemoRootStore } from "./MemoRootStore";

export default class MemoStore {
    memoRootStore: MemoRootStore;

    constructor(memoRootStore: MemoRootStore) {
        this.memoRootStore = memoRootStore;
    }

    @action getListJenisDokumen = async () => {
        try {
            const response = await agent.ListMemo.getListJenisDokumen();
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getListKategoriDokumen = async () => {
        try {
            const response = await agent.ListMemo.getListKategoriDokumen();
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getListSubKategoriDokumen = async (IdMsKategoriDokumen: Number) => {
        try {
            const response = await agent.ListMemo.getListSubKategoriDokumen(IdMsKategoriDokumen);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action buatDokumenIOM = async (param: any) => {
        try {
            const response = await agent.ListMemo.buatDokumenIOM(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action updateDokumenIOM = async (param: any) => {
        try {
            const response = await agent.ListMemo.updateDokumenIOM(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action rejectDokumenPengajuan = async (param: any) => {
        try {
            const response = await agent.ListMemo.rejectDokumenPengajuan(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getListDokumenOutstanding = async (param: any) => {
        try {
            const response = await agent.ListMemo.getListDokumenOutstanding(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action createDokumenReadHistory = async (param: any) => {
        try {
            const response = await agent.ListMemo.createDokumenReadHistory(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getListDokumenIOM = async (param: any) => {
        try {
            const response = await agent.ListMemo.getListDokumenIOM(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getListDokumenPengajuan = async (param: any) => {
        try {
            const response = await agent.ListMemo.getListDokumenPengajuan(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    
    @action getDetailDokumenIOM = async (IdDokumen: Number) => {
        try {
            const response = await agent.ListMemo.getDetailDokumenIOM(IdDokumen);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDetailDokumenPengajuan = async (IdDokumen: Number) => {
        try {
            const response = await agent.ListMemo.getDetailDokumenPengajuan(IdDokumen);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDokumenByNomor = async (nomor: String) => {
        try {
            const response = await agent.ListMemo.getDokumenByNomor(nomor);
            return response;
        } catch (error) {
            throw error;
        }
    }

}
