import { useContext, useEffect, useState } from "react";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap'

import { IVouLbr, IVouApvDtl, IVouPT } from "../../../../models/LaporanVoucherModel";
import { FinanceRootStoreContext } from "../../../../stores/FinanceRootStore";
import { getIdLogin, getUserAccess } from "../../../../../../utils/loginuseraccess";

import { RootStoreContext } from "../../../../../../stores/RootStore";

import { useLocation } from "react-router-dom";
import history from '../../../../../../utils/history';
import { title } from "process";
import { isLineBreak } from "typescript";

import moment from 'moment';
import swal from "sweetalert";

const Approval = () => {
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    
    const rootStore = useContext(RootStoreContext);

    let query = new URLSearchParams(useLocation().search);
          
    const [dataVouPT, setDataVouPT] = useState<IVouPT[]>([]);
    const [dataVouApvDtl, setDataVouApvDtl] = useState<IVouApvDtl[]>([]);
    const [dataVouLbr, setDataVouLbr] = useState<IVouLbr[]>([]);
    
    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataVouApvDtl, getDataVouLbr, getDataVouPT, rilisVouApv, isDataVouReady, getDataVouRole } = financeRootStore.laporanVoucherStore;

    const [disableButton, setDisableButton] = useState(false);
    const [show, setShow] = useState(false);
    const [buttonName, setButtonName] = useState(String);
    const [formName, setFormName] = useState(String);
    const [formTanggal, setFormTanggal] = useState(String);
    const [formRole, setFormRole] = useState(String);
    const [confirmed, setConfirmed] = useState(false);
    const handleClose = () => {
        setShow(false);
    }

    const id_ms_login: number = getIdLogin();

    useEffect(() => {
        loadRole();
           
        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 2500);
        return () => clearTimeout(timer);

    }, []);
 
    function loadRole() {
        const vouRole = getDataVouRole(id_ms_login);
        vouRole.then(function (response) {
            loadTemplate(response.result);
            loadData();
        })
    }

    function loadTemplate(role: string) {
        const formattedDate = String(query.get("tanggal"));
        setFormTanggal(formatDate(formattedDate));
        
        setFormRole(role);
        if (role === "SPV")
        {
            setButtonName("Rilis");
            setFormName('Rilis Laporan Voucher');
        }
        else if (role === "MGR")
        {
            setButtonName("Approve");
            setFormName('Approval Laporan Voucher');
        } 
        else if (role === "MGMT")
        {
            setConfirmed(true);
            setButtonName("Approve");
            setFormName('Approval Laporan Voucher');
        }
    }

    function loadData() {
        if (query.get("tanggal")) {
            let tanggal = (String(query.get("tanggal")));
            let kode_unitusaha = 'ALL';

            const voucherDetailList = getDataVouApvDtl(id_ms_login, tanggal);
            voucherDetailList.then(function (response) {
                setDataVouApvDtl(response.result);
            })
        
            const vouLbrList = getDataVouLbr(id_ms_login, tanggal, kode_unitusaha);
            vouLbrList.then(function (response) {
                setDataVouLbr(response.result);           
            })

            const vouPTList = getDataVouPT(id_ms_login, tanggal);
            vouPTList.then(function (response) {
                setDataVouPT(response.result);
            })     
        } 
    }
    
    const formatDate = (dateStr : string) => {
        const [year, month, day] = dateStr.split('-');
        let newDate = `${day}-${month}-${year}`;
        return newDate;
    };

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

    function onClickKembali(){
        history.push('#/finance/list/listlapvoucher/');
        window.location.reload();
    }
    
    function onClickRilis(){ 
        let tanggal = new Date((String(query.get("tanggal"))));
        let tanggalstr = (String(query.get("tanggal")));

        const isReady = isDataVouReady(id_ms_login, tanggalstr);
        isReady.then(function (response) {
            if (response?.result === '' || confirmed) {
                let param = {  
                    id_ms_login : id_ms_login,
                    lastmodifiedby : id_ms_login,
                    tanggalrealisasi : tanggal
                }

                const simpanData = rilisVouApv(param).then(function (response) {
                    if (response?.result === '') {
                        swal("Berhasil Menyimpan Data!",  "", "success");
                        setShow(false);
                        setTimeout(() => {onClickKembali()}, 1000);
                    } else {
                        swal("Gagal Menyimpan Data!", response?.result, "error");
                        setShow(false);
                    }
                });
            } else {
                swal("Gagal Menyimpan Data!", response?.result, "error");
                setShow(false);
                setConfirmed(true);
            }
        })       
    }
    
    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>{formName}</h2>
                    </div>
                </div>
 
                <div>
                    <h1 className="text-center">
                        REALISASI VOUCHER BKU 
                    </h1>
                    <h1 className="text-center">
                        TANGGAL GIRO {formTanggal }
                    </h1>
                </div>

                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        {dataVouPT.map(pt=>(
                        <div className="col-lg-12" key={pt.id}>
                            <div className="hr-line-dashed bg-primary" />
                            <div className="ibox">
                                <h3 className="font-bold m-b-xs">
                                    { pt.namapt }
                                </h3>
                            </div>

                            {dataVouLbr.filter(lbr => lbr.namapt == pt.namapt).map(lbr=>(
                                <div className="ibox" key={lbr.id}>
                                {/* TABLE */}
                                    <h3 className="font-bold m-b-xs">
                                        Rekening { lbr.rekening }
                                    </h3> 

                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered table-hover css-serial">
                                            
                                            {/* data voucher */}
                                            <thead>
                                                <tr>
                                                    <th className="bg-primary">#</th>
                                                    <th className="bg-primary">Nomor BKU</th>
                                                    <th className="bg-primary">Nomor Giro</th>
                                                    <th className="bg-primary">Nomor Voucher</th>
                                                    <th className="bg-primary">Nominal (Rp.)</th>
                                                    <th className="bg-primary">Kepada</th>
                                                    <th className="bg-primary">Catatan</th> 
                                                </tr>
                                            </thead>
                                            <tbody id="myTable">
                                                {dataVouApvDtl.filter(dtl => dtl.keuangan == lbr.rekening).map(data => (
                                                    <tr key={data.id} className="gradeX">
                                                        <td></td>
                                                        <td>{data.bku}</td>
                                                        <td>{data.giro}</td>
                                                        <td>{data.voucher}</td>
                                                        <td className="text-right">{formatPrice(data.nominal)} </td>
                                                        <td>{data.supplier}</td>
                                                        <td>{data.keterangan}</td>
                                                    </tr>
                                                ))}

                                                {/* jumlah halaman aka footer */}
                                                <tr>
                                                    <th scope="row"></th>
                                                        <td></td>
                                                        <td></td>
                                                        <td>{ lbr.totallembar }</td>
                                                        <td className="text-right">{formatPrice(lbr.totalnominal)} </td>
                                                        <td></td>
                                                        <td></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                            </div>
                           ))}

                            <div className="ibox">
                                <h3 className="font-bold m-b-xs">
                                    Komentar : {pt.komentar}
                                </h3>
                            </div>
                        </div>
                        ))}

                    </div>
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="form-group col-lg-12">
                            <button 
                                className="btn btn-outline btn-success btn-w-m" 
                                onClick= {() => onClickKembali()} >
                                Kembali
                            </button>
                            <button 
                                className="btn btn-primary btn-w-m" 
                                onClick= {() => onClickRilis()}>
                                {buttonName}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default {
    routeProps: {
        path: '/finance/approval/apvlapvoucher',
        exact: true,
        component: Approval
    },
    name: 'Approval',
};