import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICountedData } from "../models/CommonModel";
import { RootStoreContext } from "../stores/RootStore";
import { getIdGroup, getIdLogin, getIdLoginReplacement } from "../utils/loginuseraccess";
import { encryptData } from '../utils/encrypt';
import CryptoJS from "crypto-js";

const Home = () => {
    
    const rootStore = useContext(RootStoreContext);
    
    //get menu untuk loop ke API get Count
    const { getListDataMenu } = rootStore.authenticationStore;

    // menyimpan data count general
    const [listDataCount, setListDataCount] = useState<ICountedData[]>([]);

    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: Number = getIdLogin();

    const id_ms_login_list: any = getIdLoginReplacement();

    // Decrypt Login Data untuk get is_ms_group
    const id_ms_group: any = getIdGroup();

    // console.log(listDataCount);
    
    const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';

    id_ms_login_list.toString();
    let requestString = '{ "id_ms_login" : [' + id_ms_login_list + '], "id_ms_group" : [' + id_ms_group + ']}';
    const requestJSON = JSON.parse(requestString);

    useEffect(() => {
        
        // for (let i = 0; i < id_ms_group.length; i++) {
        //     const element = id_ms_group[i];
        // }

        const listMenu = getListDataMenu(requestJSON).then(listDataMenu => {

            // console.log(listDataMenu.result)

            for (let i = 0; i < listDataMenu.result.length; i++) {
                if (listDataMenu.result[i].path.split("/")[1] === 'procurement') {
                    setListDataCount(listDataMenu.result);
                }

                if (listDataMenu.result[i].path.split("/")[1] === 'accounting') {
                    setListDataCount(listDataMenu.result);
                }

                if (listDataMenu.result[i].path.split("/")[1] === 'finance') {
                    setListDataCount(listDataMenu.result);
                }

                if (listDataMenu.result[i].path.split("/")[1] === 'hr') {
                    setListDataCount(listDataMenu.result);
                }
            }
        })
    }, [])


    return (
        <div>
            <div className="wrapper wrapper-content">
                <div className="row">

                    {listDataCount.map(data => (

                        <div className="col-lg-3" key={data.namaForm}>
                            <div className="ibox ">
                                <div className="wrapper bg-primary">

                                    <Link title="Klik disini untuk ke list data" className="btn btn-primary btn-block" to={data.path} >  {/* + '?idlg=' + `${encryptData(data.id_ms_login, salt)}` */}

                                        {data.id_ms_login == id_ms_login ? '' : <h5>{data.userkaryawan} - {data.divisi}</h5>}

                                        <h3>{data.namaForm}</h3>
                                    </Link>

                                </div>
                                <div className="ibox-content">
                                    <h1 className="no-margins"><b>{data.listCount}</b></h1>
                                    {/* <div className="stat-percent font-bold text-success">98% <i className="fa fa-bolt"></i></div> */}
                                    <small>Total Data</small>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </div>

    )

}


export default Home;