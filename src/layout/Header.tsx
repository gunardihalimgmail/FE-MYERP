import React, { Component, useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Store } from "react-notifications-component";
import { FinanceRootStoreContext } from "../modules/finance/stores/FinanceRootStore";

import 'react-notifications-component/dist/theme.css'
import { getGroupName, getIdLogin } from '../utils/loginuseraccess';
import { IResultDataListKirimTerima } from '../modules/finance/models/ApprovalSPDModel';


const Header = () => {
    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataSPDTerima } = financeRootStore.approvalSPDStore;

    const id_ms_login: Number = getIdLogin();
    const groupName: String = getGroupName();

    let [dataSPDTerima, setDataSPDTerima] = useState<IResultDataListKirimTerima>();



    useEffect(() => {
        
        if (groupName.toUpperCase().includes("MANAGER")) {
            loadData();
            setInterval(clickTrigger, 1000);
        }
        
    }, [])


    function clickTrigger() {
        var sec = 0;
        var tmpSec = localStorage.getItem('secs')
        if (tmpSec != null) {
            sec = parseInt(tmpSec, 10);
        }

        ++sec

        localStorage.setItem('secs', String(sec))

        // console.log(sec);

        if (sec / 60 % 60 == 20) { // Setiap 20 menit pull notif
            localStorage.setItem('secs', String(0))
            loadData();
            document.getElementById("btnPullNotif")?.click();

        }

        // loadData();
        // document.getElementById("btnPushNotif")?.click();

    }


    function loadData() {
        
        const SPDKirimList = getDataSPDTerima(id_ms_login).then(responseSPDTerima => { // id_ms_login_link == null ? id_ms_login : id_ms_login_link

            setDataSPDTerima(responseSPDTerima.result);
        })

    }


    // render() {
    return (

        <div className="row border-bottom">
            
            <nav className="navbar navbar-static-top" role="navigation">
                <div className="navbar-header">
                    <a className="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i className="fa fa-bars"></i> </a>

                    <form role="search" className="navbar-form-custom" action="#">
                        <div className="form-group">
                        </div>
                    </form>

                    {/* {groupName.toUpperCase().includes("MANAGER") ?

                        <ul className="nav navbar-top-links">
                            <li className="dropdown">
                                <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                                    <i className="fa fa-2x fa-bell"></i>  <span className="label label-primary">{dataSPDTerima?.spdKirimTerimaList.length!}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-alerts" style={{ backgroundColor: "#FFCF8B" }}>
                                    <li >
                                        <Link to="/finance/approval/terimadokumenspd" >
                                            <div >
                                                <i className="fa fa-envelope fa-fw"></i> <strong> Anda memiliki {dataSPDTerima?.spdKirimTerimaList.length!} dokumen SPD yang belum di Approve </strong>
                                            </div>
                                        </Link>
                                    </li>

                                </ul>
                            </li>
                        </ul>

                        :

                        ''

                    } */}

                </div>


                <ul className="nav navbar-top-links navbar-right">

                    <li>
                        <span className="m-r-sm text-muted welcome-message"></span>
                    </li>

                    <li>
                        
                        {dataSPDTerima?.dataKaryawan?.iD_Ms_Jabatan === 3 ?

                            dataSPDTerima?.spdKirimTerimaList.length! > 0 ?

                                <Button
                                    style={{ display: "none" }}
                                    id="btnPullNotif"
                                    onClick={() => {
                                        Store.addNotification({
                                            title: "Notification",
                                            message: "Anda memiliki " + dataSPDTerima?.spdKirimTerimaList.length! + " dokumen SPD yang belum di Approve",
                                            type: "default", // 'default', 'success', 'info', 'warning'
                                            container: "bottom-left", // where to position the notifications
                                            animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
                                            animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
                                            dismiss: {
                                                duration: 15000,
                                                onScreen: true
                                            }
                                        });
                                    }}
                                >
                                    Add Notification
                                </Button>

                                : ''

                                :

                                ''}

                        {/* <a href="#">
                                <i className="fa fa-sign-out"></i> Log out
                            </a> */}
                    </li>
                </ul>

            </nav>
        </div>
    )
    // }
}

export default Header;