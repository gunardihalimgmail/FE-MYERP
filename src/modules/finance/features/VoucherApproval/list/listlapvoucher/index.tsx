import { useContext, useEffect, useState } from "react";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap'

import {Link} from 'react-router-dom';

import { IVouApv } from "../../../../models/LaporanVoucherModel";
import { FinanceRootStoreContext } from "../../../../stores/FinanceRootStore";
import { getIdLogin, getUserAccess } from "../../../../../../utils/loginuseraccess";

import history from '../../../../../../utils/history';

const List = () => {
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'List Laporan Voucher';

    const [dataVoucherApv, setDataVoucherApv] = useState<IVouApv[]>([]);
    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataVouApv } = financeRootStore.laporanVoucherStore;

    const [disableButton, setDisableButton] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }

    const id_ms_login: number = getIdLogin();

    useEffect(() => {
        loadData();

        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 2500);
        return () => clearTimeout(timer);

    }, []);

    function loadData() {
        const voucherBKUList = getDataVouApv(id_ms_login);
        voucherBKUList.then(function (response) {
            if (Array.isArray(response.result))
            {
                setDataVoucherApv(response.result);
            }
            else{
                setDataVoucherApv([]);
            }
        })

        setShow(true);
    }
    
    function formatPrice(value: number) {
        if (value < 0) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            var aa = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            return '(' + aa.replace('-', '') + ')'
        } else {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
    }

    function onClickLogout(){
        history.push('#/finance/approval/apvlapvoucher?id=${supplier.id}');
        window.location.reload();
    }

    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>{formName}</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Voucher BKU List</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="ibox-content">
                                    {/* <div className="col-md-2 ml-md-auto">
                                        <Link className="btn btn-primary btn-block" to="/addparkir" >Add</Link>
                                    </div> */}
                                </div>

                                <div className="ibox-content">
                                    <div className="table-responsive">

                                        <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                            className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />


                                        <br /><br /><br />
                                        <table className="table table-striped table-bordered table-hover css-serial">
                                            <thead>
                                                <tr>
                                                    <th className="bg-primary">#</th>
                                                    <th className="bg-primary">Keterangan</th>
                                                    <th className="bg-primary">Manager Approval</th>
                                                    <th className="bg-primary" style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody id="myTable">
                                                {dataVoucherApv.map(data => (
                                                    <tr key={data.id} className="gradeX">
                                                        <td></td>
                                                        <td>{data.keterangan}</td>
                                                        <td>{data.mgrapvtime}</td>
                                                        <td style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                                                            <div className="btn-group">
                                                            <Link to={`/finance/approval/apvlapvoucher?tanggal=${data.tanggal}`} className="btn-white btn btn-xs">
                                                                <i className="fa fa-play"></i> Detail
                                                            </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default {
    routeProps: {
        path: '/finance/list/listlapvoucher',
        exact: true,
        component: List
    },
    name: 'List',
};