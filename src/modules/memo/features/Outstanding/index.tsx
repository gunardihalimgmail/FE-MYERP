import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { getBagianName, getIdDivisi, getIdLogin, getIdUnitUsaha, getUserAccess } from "../../../../utils/loginuseraccess";
import SyncLoader from "react-spinners/SyncLoader";
import { Link, Redirect, useLocation } from "react-router-dom";
import { encryptData } from "../../../../utils/encrypt";
import { MemoRootStoreContext } from "../../stores/MemoRootStore";
import { ListDokumenResult } from "../../models/MemoModel";
import { colors } from "react-select/src/theme";



const OutstandingMemo = () => {
    const modulname = 'memo'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'Outstanding IOM';

    const memoRootStore = useContext(MemoRootStoreContext);
    const { getListDokumenOutstanding, createDokumenReadHistory } = memoRootStore.memoStore;


    const [show, setShow] = useState(false);
    const [IdDokumen, setIdDokumen] = useState(0)
    const [linkToDetailPengajuan, setOnLinkToDetailPengajuan] = useState(false)
    const [linkToDetailIOM, setOnLinkToDetailIOM] = useState(false)
    const [dataListDokumenOutstanding, setDataListDokumenOutstanding] = useState<ListDokumenResult[]>([]);

    const handleClose = () => {
        setShow(false);
    }


    const id_ms_login: Number = getIdLogin();
    const bagian: String = getBagianName();
    const id_ms_divisi: Number = getIdDivisi();
    const id_ms_unitusaha: Number = getIdUnitUsaha();

    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulname, formName);

    useEffect(() => {

        // refresh data setelah transaksi 
        loadData();
        loadjs();


    }, []);


    // loadjs
    function loadjs() {
        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 200);
        return () => clearTimeout(timer);
    }


    // Load data list 
    function loadData() {

        let requestParam = {
            idLogin: id_ms_login,
            idUnitUsaha: id_ms_unitusaha,
            idDivisi: id_ms_divisi,
            bagian: bagian
        }

        // console.log(requestParam)

        const listDocOutstd = getListDokumenOutstanding(requestParam).then(function (response) {
            if (response.statusCode === 200) {
                setDataListDokumenOutstanding(response.result);
            }
        })
    }


    function handleLinkToDetailIOM(idDok: number) {
        const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
        const idDokEncrypt = encryptData(idDok, salt);
        localStorage.setItem('pidd', idDokEncrypt);

        let requestParam = {
            IdDokumen: idDok,
            IdLogin: id_ms_login,
            IdDivisi: id_ms_divisi
        }

        const createReadHistory = createDokumenReadHistory(requestParam).then(function (response) {
            if (response.statusCode === 200) {
                
            }
        })

        setIdDokumen(idDok);
        setOnLinkToDetailIOM(true);
    }

    function handleLinkToDetailPengajuan(idDok: number) {
        const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
        const idDokEncrypt = encryptData(idDok, salt);
        localStorage.setItem('pidd', idDokEncrypt);

        let requestParam = {
            IdDokumen: idDok,
            IdLogin: id_ms_login,
            IdDivisi: id_ms_divisi
        }

        const createReadHistory = createDokumenReadHistory(requestParam).then(function (response) {
            if (response.statusCode === 200) {
                
            }
        })
        
        setIdDokumen(idDok);
        setOnLinkToDetailPengajuan(true);
    }


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Outstanding IOM</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Outstanding IOM List</h5>
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


                                        <div>
                                            <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                                className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />


                                            <br /><br /><br />
                                            <p style={{color: "red"}}>*Perhatian : Dokumen yang sudah dibaca detailnya akan hilang dari list ini</p>
                                            <table className="table table-striped table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th className="bg-primary">Detail</th>
                                                        <th className="bg-primary">Status Dokumen</th>
                                                        <th className="bg-primary">Jenis Dokumen</th>
                                                        <th className="bg-primary">Scope Dokumen</th>
                                                        <th className="bg-primary">Kategori</th>
                                                        <th className="bg-primary">Sub Kategori</th>
                                                        <th className="bg-primary">Nomor</th>
                                                        <th className="bg-primary">Subject</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">

                                                    {dataListDokumenOutstanding?.map(data =>
                                                        <tr>
                                                            <td className="">
                                                                <div className="btn-group">
                                                                    {data.jenisDokumen.match("Pengajuan") ?

                                                                        <Button onClick={() => handleLinkToDetailPengajuan(data.idDokumen)} className="btn btn-success" type="button"><i className="fa fa-info" aria-hidden="true"></i></Button>

                                                                        :

                                                                        <Button onClick={() => handleLinkToDetailIOM(data.idDokumen)} className="btn btn-success" type="button"><i className="fa fa-info" aria-hidden="true"></i></Button>

                                                                    }

                                                                </div>
                                                            </td>
                                                            <td> <p><span className={data.statusDokumen == "Active" ? "label label-primary" : "label label-danger"} >{data.isReject === 1 ? 'Rejected By: ' + data.rejectName : data.statusDokumen }</span></p></td>
                                                          
                                                            <td>{data.jenisDokumen}</td>
                                                            <td>{data.scopeDokumen}</td>
                                                            <td>{data.kategori}</td>
                                                            <td>{data.subKategori}</td>
                                                            <td>{data.nomor}</td>
                                                            <td>{data.subject}</td>
                                                        </tr>
                                                    )
                                                    }


                                                </tbody>

                                            </table>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {
                    linkToDetailIOM ?
                        <>
                            return <Redirect push
                                to={{
                                    pathname: "/memo/detail/detailmemo",
                                    // state: {
                                    //     pidd: IdDokumen,
                                    //     // pidj: IdJenisDokumenMask
                                    // }
                                }}
                            />
                        </> : <></>
                }

                {
                    linkToDetailPengajuan ?
                        <>
                            return <Redirect push
                                to={{
                                    pathname: "/memo/detail/detailpengajuan",
                                    // state: {
                                    //     pidd: IdDokumen,
                                    //     // pidj: IdJenisDokumenMask
                                    // }
                                }}
                            />
                        </> : <></>
                }
            </div>

        </>
    );
};

export default {
    routeProps: {
        path: '/memo/list/outstandingmemo',
        exact: true,
        component: OutstandingMemo
    },
    name: 'OutstandingMemo',
};