import { configure } from 'mobx';
import { createContext } from 'react';
import CommonStore from './CommonStore';
import AuthenticationStore from './AuthenticationStore';

configure({enforceActions: 'always'});

export class RootStore {
    commonStore: CommonStore;
    authenticationStore: AuthenticationStore;
    
    constructor() {
        this.commonStore = new CommonStore(this);
        this.authenticationStore = new AuthenticationStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore()); 