import { HRRootStore } from "./HRRootStore";
import { action } from "mobx";
import agent from "../api/agent";

export default class PengajuanGradeStore {
    hrRootStore: HRRootStore;
    constructor(hrRootStore: HRRootStore) {
        this.hrRootStore = hrRootStore;
    }

    @action ListPengajuanGrade = async () => {
        try {
            const response = await agent.ApprovalPengajuanGrade.getListPengajuanGrade();

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    @action DetailPengajuanGradeKaryawan = async (id: number) => {
        try {
            const response = await agent.ApprovalPengajuanGrade.getDetailPengajuanGradeKaryawan(id);

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    @action UpdateApprovalGrade = async (param: any) => {
        try {
            const response = await agent.ApprovalPengajuanGrade.updateApprovalGradeKaryawan(param);

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };
}
