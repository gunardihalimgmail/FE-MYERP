import { FinanceRootStore } from "./FinanceRootStore";
import { action, runInAction, observable } from "mobx";
import agent from "../api/agent";

export default class LaporanVoucherStore {
    financeRootStore: FinanceRootStore;

    constructor(financeRootStore: FinanceRootStore) {
        this.financeRootStore = financeRootStore;
    }
    
    @action getDataVouBKU = async (id_ms_login: number, tanggal: string, pt: string) => {
        try {
            const response = await agent.LaporanVoucher.getVouBKU(id_ms_login, tanggal, pt);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataVouApvDtl = async (id_ms_login: number, tanggal: string) => {
        try {
            const response = await agent.LaporanVoucher.getVouApvDtl(id_ms_login, tanggal);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataVouApv = async (id_ms_login: number) => {
        try {
            const response = await agent.LaporanVoucher.getVouApv(id_ms_login);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataVouLbr = async (id_ms_login: number, tanggal: string, pt: string) => {
        try {
            const response = await agent.LaporanVoucher.getVouLbr(id_ms_login, tanggal, pt);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataVouPT = async (id_ms_login: number, tanggal: string) => {
        try {
            const response = await agent.LaporanVoucher.getVouPT(id_ms_login, tanggal);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataOpsiPT = async (id_ms_login: number, tanggal: string) => {
        try {
            const response = await agent.LaporanVoucher.getOpsiPT(id_ms_login, tanggal);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action createVouDtl = async (param: any) => {
        try {
            const response = await agent.LaporanVoucher.createVouDtl(param);
            return response;
        } catch (error) {
            throw error;
        }
    }
    
    @action rilisVouApv = async (param: any) => {
        try {
            const response = await agent.LaporanVoucher.rilisVouApv(param);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action isDataVouReady = async (id_ms_login: number, tanggal: string) => {
        try {
            const response = await agent.LaporanVoucher.isVouReady(id_ms_login, tanggal);
            return response;
        } catch (error) {
            throw error;
        }
    }

    @action getDataVouRole = async (id_ms_login: number) => {
        try {
            const response = await agent.LaporanVoucher.getVouRole(id_ms_login);
            return response;
        } catch (error) {
            throw error;
        }
    }

}