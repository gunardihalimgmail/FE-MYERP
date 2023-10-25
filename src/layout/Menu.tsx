import React, {useEffect, useState, useContext} from 'react';
import { IMenu } from '../models/CommonModel';
import { RootStoreContext } from '../stores/RootStore';
import history from '../utils/history'
import { Link } from 'react-router-dom';
import { decryptData } from '../utils/encrypt';

const Menu = () => {

    const [currentTab, setCurrentTab] = useState('');
    const [currentSubMenu, setCurrentSubMenu] = useState('');
    const [currentMenu, setCurrentMenu] = useState('');
    const rootStore = useContext(RootStoreContext);
    const { getMenu, logout } = rootStore.authenticationStore;

    const distinctFlag: string[] = [];
    const [moduleList, setMenuList] = useState<IMenu[]>([]);
    const [userLoginName, setUserLoginName] = useState();

    // Distinct Flags
    for (let index = 0; index < moduleList.length; index++) {
        const element = moduleList[index];
        element.forms.map(tag => {
            if (distinctFlag.indexOf(tag.formflag + '|' + tag.namamodul) === -1) {
                distinctFlag.push(tag.formflag + '|' + tag.namamodul)
            }
        });
    }

    console.log(distinctFlag)
    

    useEffect(() => {
        
        const requestArray = [];
        var loginDataEncrypted = localStorage.ld
        var IdMsGroupEncrypted = localStorage.grplist

        // decrypt local storage logindata
        const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
        const LoginDatadecryptedData = decryptData(loginDataEncrypted, salt);
        const IdMsGroupdecryptedData = decryptData(IdMsGroupEncrypted, salt);
        const JSONLoginData = JSON.parse(LoginDatadecryptedData);
        const JSONIdMsGroupData = JSON.parse(IdMsGroupdecryptedData);
        for (let i = 0; i < JSONLoginData.length; i++) {
            const element = JSONLoginData[i];
            setUserLoginName(element.namakaryawan);
        }

        // for (let i = 0; i < JSONIdMsGroupData.length; i++) {
        //     const element = JSONIdMsGroupData[i];
        //     requestArray[i] = element;
        // }

        // membuat object request ke API
        JSONIdMsGroupData.toString();

        let requestString = '{ "id_ms_group" : [' + JSONIdMsGroupData + ']}';
        const requestJSON = JSON.parse(requestString);
        

        const listMenu = getMenu(requestJSON);
            listMenu.then(function(response) {
            setMenuList(response.result);
        }) 
        
    }, [])

    function onClickLogout(){
        logout();

        history.push('/');
        window.location.reload();
    }

    return (
        <nav className="navbar-default navbar-static-side" 
                // style = {{zIndex:3}}
                role="navigation">
            <div className="sidebar-collapse"
                    // style = {{position:'fixed'}}
                    >
                <ul className="nav metismenu" 
                        id="side-menu">
                    <li className="nav-header">
                        <div className="dropdown profile-element">
                            <a data-toggle="dropdown" className="dropdown-toggle" href="#"> 
                                <h3 className="block m-t-xs font-bold">{userLoginName}</h3>
                                {/* <span className="text-muted text-xs block">Best Agro International<b className="caret"></b></span> */}
                            </a>
                            <ul className="dropdown-menu animated fadeInRight m-t-xs">
                                <li><a className="dropdown-item" href="#">Dashboard</a></li>
                                <li><Link to="/changepassword"> Change Password </Link> </li>
                            </ul>
                        </div>
                        <div className="logo-element">
                        <a href="#">
                                <h3 className="block m-t-xs font-bold">BEST</h3>
                                
                            </a>
                            
                        </div>
                    </li>

                    {moduleList.map((menu,idx) => (
                        <li key={menu.modulname} className={currentTab === menu.modulname ? 'active' : ''}>
                            <Link to={menu.modulpath} onClick={() => setCurrentTab(menu.modulname)}><i className={menu.modulicon}></i> 
                                <span className="nav-label">{menu.modulname}</span> 
                                <span className={menu.modularrow}></span> 
                            </Link>
                            {
                                menu.forms.length === 0 ? '' :
                                <ul key={menu.modulname} className={currentTab === menu.modulname ? 'nav nav-second-level collapse in' : 'nav nav-second-level collapse'}>

                                    {distinctFlag.filter(x => x.includes(menu.modulname)).map(flag => (
                                        
                                        <li key={flag} className={currentSubMenu === flag ? 'active' : ''}>
                                            <Link to="#" onClick={() => setCurrentSubMenu(flag)}>
                                                {flag.split("|")[0]}
                                                <span className={menu.modularrow}></span>
                                            </Link>

                                            <ul key={flag} className={currentSubMenu === flag ? 'nav nav-third-level collapse in' : 'nav nav-third-level collapse'}>
                                                
                                                {/* tidak boleh pakai menu.modulname karena menu.forms dari module menampilkan semua form dan semua modul
                                                    dan yang di concat menggunakan menu.modulname yang sudah fix satu modul saja, sehingga jadi 'List OP|Finance' (seharusnya 'List OP|Procurement'), 'List SPD|Finance' (List OP|Finance)
                                                    --> impact nya satu modul mendapatkan semua form kalau nama flag nya sama (misal: List)

                                                {menu.forms.filter(filters => filters.formflag.concat("|" + menu.modulname) == flag).map(form => ( */}

                                                {menu.forms.filter(filters => filters.formflag.concat("|" + filters.namamodul) == flag).map(form => (
                                                        <li key = {form.formname} className={currentMenu === form.formname ? 'active' : ''}> {/*  */}
                                                            <Link to={form.formpath} onClick={() => setCurrentMenu(form.formname)}>{form.formname}</Link> {/*  */}
                                                        </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </li>
                    ))}

                    <li>
                        <a href="" onClick={onClickLogout} ><i className="fa fa-sign-out"></i> <span className="nav-label">Log out</span></a>
                    </li>
                </ul>
            </div>
        </nav>
   )
}

export default Menu;
