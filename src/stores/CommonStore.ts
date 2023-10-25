import {RootStore,} from './RootStore';
import {action,observable, reaction} from 'mobx';
import { useLocation } from 'react-router-dom';
import agent from '../api/agent';

export default class CommonStore {

    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('token', token);
                } else {
                    window.localStorage.removeItem('token')
                }
            },
        )
    }

    @observable token: string | null = window.localStorage.getItem('token');

    @action setToken = (token: string | null) => {
        this.token = token;
        if (token != null) {
          window.localStorage.setItem("token", token);
        } else {
          window.localStorage.removeItem("token");
        }
    };

    @action getUnitUsahaKode = async () => {
        try {
            const response = await agent.UnitUsaha.listUnitUsahaKode();
            return response;
        } catch (error) {
            throw error;
        }
    };

}