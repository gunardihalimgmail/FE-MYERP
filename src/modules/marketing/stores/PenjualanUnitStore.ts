import { MarketingRootStore } from "./MarketingRootStore";
import { action } from "mobx";
import agent from "../api/agent";

export default class PenjualanUnitStore {
    marketingRootStore: MarketingRootStore;
    constructor(marketingRootStore: MarketingRootStore) {
        this.marketingRootStore = marketingRootStore;
    }

    // @observable listunit: IApprovalPenjualanUnitList | null = null;

    @action PenjualanUnitList = async (id: any) => {
        try {
            const response = await agent.ApprovalPenjualanUnit.approvalPenjualanUnitList(Number(id));

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    @action PenjualanUnitListCount = async (param: any) => {
        try {
            const response = await agent.ApprovalPenjualanUnit.approvalPenjualanUnitListCount(param);

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    @action PenjualanUnitDetail = async (id: number) => {
        try {
            const response = await agent.ApprovalPenjualanUnit.approvalPenjualanUnitDetail(id);

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    @action PenjualanUnitDetailDocument = async (id: number, flag: string) => {
        try {
            const response = await agent.ApprovalPenjualanUnit.approvalPenjualanUnitDetailDocument(id, flag);

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    @action PenjualanUnitApproveOrReject = async (param: any) => {
        try {
            const response = await agent.ApprovalPenjualanUnit.approvalPenjualanUnitApproveOrReject(param);

            if (response.result !== null) {
                return response;
            }
        } catch (error) {
            throw error;
        }
    };
}
