import { useContext, useEffect, useState, ChangeEvent } from "react";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import swal from "sweetalert";
import  DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { IVouApvDtl, IOpsiPT, IVouPT, IVouLbr } from "../../../../models/LaporanVoucherModel";
import { FinanceRootStoreContext } from "../../../../stores/FinanceRootStore";
import { getIdLogin, getUserAccess, getKaryawanLogin } from "../../../../../../utils/loginuseraccess";

import moment from 'moment';
import { parseJsonText } from "typescript";

const Buat = () => {
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'Buat Laporan Voucher';
    const nodata = 'Tidak Ada Data'

    const [dataVouBKU, setDataVouBKU] = useState<IVouApvDtl[]>([]);
    const [dataOpsiPT, setDataOpsiPT] = useState<IOpsiPT[]>([]);
    const [dataVouPT, setDataVouPT] = useState<String>();
    const [dataVouCmt, setDataVouCmt] = useState<any>();

    const [dataVouApvDtl, setDataVouApvDtl] = useState<IVouApvDtl[]>([]);
    const [dataVouLbr, setDataVouLbr] = useState<IVouLbr[]>([]);

    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataVouBKU, getDataOpsiPT, getDataVouLbr, getDataVouPT, createVouDtl  } = financeRootStore.laporanVoucherStore;

    const [disableButton, setDisableButton] = useState(false);
    const [show, setShow] = useState(false);

    const [showDtTbl, setShowDtTbl] = useState(false);
    const [showNoDt, setShowNoDt] = useState(false);
    const [formTanggal, setFormTanggal] = useState(String);
    const [formPT, setFormPT] = useState(String);

    const handleClose = () => {
        setShow(false);
    }

    const id_ms_login: number = getIdLogin();
    const namakaryawan: string = getKaryawanLogin();

    const [dataVouDate, setDataVouDate] = useState(new Date());

    useEffect(() => {
        loadPT();

        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 2500);
        return () => clearTimeout(timer);

    }, []);

    function loadPT() {      
        let tanggal = String(moment(dataVouDate).format('YYYY-MM-DD'));
        const opsiPTList = getDataOpsiPT(id_ms_login, tanggal);
        opsiPTList.then(function (response) {
            if (Array.isArray(response.result))
            {
                setDataOpsiPT(response.result);
            }
            else{
                setDataOpsiPT([]);
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

    function onClickCari() {
        setDisableButton(false);
        setDataVouCmt('');
        
        if(dataVouPT !== undefined && dataVouPT !== '')
        {
            setFormTanggal(String(moment(dataVouDate).format('DD-MM-YYYY')));
            setFormPT(dataOpsiPT.filter((e) => e.id === Number(dataVouPT))[0].namapt);

            let id_ms_unitusaha = Number(dataVouPT);
            let kode_unitusaha = dataOpsiPT.filter((e) => e.id === id_ms_unitusaha)[0].kodept;
            let tanggal_str = String(moment(dataVouDate).format('YYYY-MM-DD'));

            const voucherBKUList = getDataVouBKU(id_ms_login, tanggal_str, kode_unitusaha);
            voucherBKUList.then(function (response) {
                if (response.result.length == 0 || response.result === undefined) {
                    setShowNoDt(true);
                    setShowDtTbl(false);
                    setDataVouBKU([]);
                } else {
                    setShowNoDt(false);
                    setShowDtTbl(true);
                    setDataVouBKU(response.result);
                }   
            })

            const vouLbrList = getDataVouLbr(id_ms_login, tanggal_str, kode_unitusaha);
            vouLbrList.then(function (response) {
                setDataVouLbr(response.result);           
            })
        }
    }

    const handleCmt = (event: ChangeEvent<HTMLInputElement>) => {
        event.persist();
        setDataVouCmt(event.target.value);
    };
      
    function onCLickSimpan() {
        setDisableButton(true);
        let tanggal =  moment(dataVouDate, 'DD-MM-YYYY');
        let id_ms_unitusaha = Number(dataVouPT);
        let kode_unitusaha = dataOpsiPT.filter((e) => e.id === id_ms_unitusaha)[0].kodept;
        let id_ms_bagian = 1;
        let statusrelease = 'N';
        let now = new Date();
        let param = {
            id_fn_realisasivoucher : 0,
            id_ms_unitusaha : id_ms_unitusaha,
            kode_unitusaha : kode_unitusaha,
            tanggalrealisasi : tanggal,
            modifystatus : 'I',
            lastmodifiedby : id_ms_login,
            lastmodifiedtime : now,
            createdby : id_ms_login,
            createdtime : now,
            statusrelease : statusrelease,
            id_ms_bagian : id_ms_bagian,
            komentar : dataVouCmt
        }

        const simpanData = createVouDtl(param).then(function (response) {
            if (response?.result === '') {
                swal("Berhasil Menyimpan Data!", "", "success");
                setShow(false);
                setDataVouCmt('');
                loadPT();
            } else {
                swal("Gagal Menyimpan Data!", response?.result, "error");
                setShow(false);
                setDisableButton(false);
            }
        });
    }

    const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setDataVouPT(value);
    };

    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Buat Laporan Voucher</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Kriteria Pencarian</h5>
                                </div>

                                <div className="ibox-content has-success">
                                    <div className="input-group-prepend m-b">
                                        <span className="input-group-addon col-1">
                                            <i className="fa fa-calendar"></i>
                                        </span>
                                        <DatePicker className ="form-control" 
                                            selected={dataVouDate} 
                                            onChange={(date:Date) => setDataVouDate(date)}
                                            peekNextMonth
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            dateFormat="dd/MM/yyyy"
                                            /> 
                                    </div>    
                                
                                    <div className="input-group-prepend m-b">
                                        <span className="input-group-addon col-1">
                                            <i className="fa fa-building"></i>
                                        </span>
                                        <select className="form-control" onChange={selectChange}>
                                            <option value="">Pilih Unit Usaha</option>
                                            {dataOpsiPT.map((pt => 
                                                <option value={pt.id} key={pt.id}>{pt.kodept + ' - ' + pt.namapt }</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <button type="button" className="btn btn-primary btn-rounded btn-block"
                                        onClick={() => onClickCari()}
                                        >
                                            CARI
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="ibox-content" style={{ display: (showNoDt ? 'block' : 'none') }}>
                                <div className="alert alert-danger">
                                    {nodata}
                                </div>
                            </div>

                            <div className="ibox" style={{ display: (showDtTbl ? 'block' : 'none') }}>
                                <div className="ibox-content">   
                                    <div className="ibox-title">
                                        <h2 className="text-center">
                                            REALISASI VOUCHER BKU 
                                        </h2>
                                        <h2 className="text-center">
                                            TANGGAL GIRO {formTanggal }
                                        </h2>
                                        <h2 className="text-center">
                                            {formPT}
                                        </h2>
                                    </div>
                                </div>

                                <div className="ibox" style={{ display: (showDtTbl ? 'block' : 'block') }}>
                                    {
                                    dataVouLbr.map(lbr=>(
                                        <div className="ibox-content" key={lbr.id}>
                                            <div>
                                                <h3 className="font-bold m-b-xs">
                                                Rekening { lbr.rekening }
                                                </h3>
                                            </div>
                                            {/* table */}  
                                            <div>
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
                                                            {dataVouBKU.filter(dtl => dtl.keuangan == lbr.rekening).map((data, idx) => (
                                                                <tr key={data.id} className="gradeX">
                                                                    <td>{idx + 1}</td>
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
                                                                    <td>{ formatPrice(lbr.totalnominal) } </td>
                                                                    <td></td>
                                                                    <td></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    }

                                    <div className="ibox-content has-success">
                                        <div className="input-group-prepend m-b">
                                            <span className="input-group-addon col-1">
                                                <i className="fa fa-user"></i>
                                            </span>
                                            {/* <input type="text" value={namakaryawan}
                                                className="form-control" 
                                                /> */}
                                        </div>

                                        <div className="input-group-prepend m-b">
                                            <span className="input-group-addon col-1">
                                                <i className="fa fa-comment"></i>
                                            </span>
                                            <input
                                                className="form-control" 
                                                type="text"
                                                placeholder="Komentar."
                                                name="dataVouCmt" 
                                                value={dataVouCmt}
                                                onChange={handleCmt}/>
                                        </div>

                                        <div>
                                            <button type="button" 
                                            className="btn btn-primary btn-rounded btn-block"
                                            onClick={() => onCLickSimpan()}
                                            disabled={disableButton}
                                            >
                                                SIMPAN
                                            </button>
                                        </div>
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
        path: '/finance/transaksi/buatlapvoucher',
        exact: true,
        component: Buat
    },
    name: 'Buat Laporan Voucher',
};