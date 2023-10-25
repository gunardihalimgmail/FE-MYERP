import { action } from "mobx";
import { ProcurementRootStore } from "./ProcurementRootStore";
import agent from "../api/agent";

export default class ListOPStore {
    procurementRootStore:ProcurementRootStore;

    constructor(procurementRootStore: ProcurementRootStore){
        this.procurementRootStore = procurementRootStore;
    }

    @action getDataOP = async (param:any) => {
        try {
            const response = await agent.ListOP.getListOP(param);
            return response;
        }catch(error){
            throw error;
        }
    }

    // @action getDataOPDetail = async(id:number) => {
    @action getDataOPDetail = async(param:any) => {
        try {
            // const response = await agent.ListOP.getListOPDetail(id);
            const response = await agent.ListOP.getListOPDetail(param);
            return response;
        }catch(error){
            throw error;
        }
    }
}