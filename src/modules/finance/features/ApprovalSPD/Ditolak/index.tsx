import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import SyncLoader from "react-spinners/SyncLoader";
import { Field, Form } from "react-final-form";
import React from "react";
import { FinanceRootStoreContext } from "../../../stores/FinanceRootStore";
import { IDokumenFlowStatus, IOpsiTujuanList, IResultDataListKirimTerima, ISPDKirimTerimaList } from "../../../models/ApprovalSPDModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";
import Select from 'react-select';
import { useLocation } from "react-router-dom";
import { decryptData } from "../../../../../utils/encrypt";


const SPDDitolak = () => {
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'SPD Ditolak';

    const [dataSPDDitolak, setDataSPDDitolak] = useState<IResultDataListKirimTerima>();
    const [modalData, setModalData] = useState<IDokumenFlowStatus[]>();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // const [modalData, setModalData] = useState<BKUDetailOPLPB>();

    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataSPDDitolak, terimaDocSpd, getDokFlowStatusSpd } = financeRootStore.approvalSPDStore;


    var id = new URLSearchParams(useLocation().search);
    const id_ms_login_link = id.get("idlg");

    // const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    // const id_ms_login_link_decrypt = decryptData(String(id_ms_login_link), salt);


    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: Number = getIdLogin();


    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulname, formName);
    // console.log(user_access)

    // Select Multiple Doc
    let anchorCheck = document.getElementById("showCheckedRowButton");
    let anchorSort = document.getElementById("sortButton");
    const [stateDocKey, setstateDocKey] = useState<Array<string>>([]);
    const [stateDoc, setstateDoc] = useState<ISPDKirimTerimaList[]>([]);

    const selectDoc = (documentSelected: any, selectedId: string, acctionMethod: string) => {

        if (stateDocKey.includes(selectedId)) {
            const newDocKey = stateDocKey.filter((id) => id !== selectedId);
            const newDoc = stateDoc.filter((id) => id !== documentSelected);
            setstateDocKey(newDocKey);
            setstateDoc(newDoc);
        }
        else {
            const newDocKey = [...stateDocKey];
            const newDoc = [...stateDoc];
            var replacedString = selectedId.replace("\r", "");

            newDocKey.push(replacedString);
            newDoc.push(documentSelected);
            setstateDocKey(newDocKey);
            setstateDoc(newDoc);


            if (acctionMethod == "pressed") {
                anchorCheck?.click()
                anchorSort?.click()
            }
        }
    };


    // Count scanned row
    function distictCount() {
        const distinctDocKey: string[] = [];
        stateDocKey.map(data => {
            if (distinctDocKey.indexOf(data) === -1) {
                distinctDocKey.push(data)
            }
        });

        return distinctDocKey.length;
    }

    console.log(stateDocKey)

    useEffect(() => {

        // var docKeyString = "";
        // function handleKeyPress(event: { keyCode: any; which: any; }) {
        //     docKeyString += String.fromCharCode(event.which)

        //     if (event.keyCode === 13) {
        //         selectDoc(docKeyString, "pressed");
        //         docKeyString = "";
        //     }
        // }

        // window.addEventListener('keypress', handleKeyPress);

        // refresh data setelah transaksi
        loadData();

        loadjs();

    }, []);

    function loadjs() {
        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 300);
        return () => {
            clearTimeout(timer);
        }
    }

    // Load data list BKU dan Akun
    function loadData() {

        const SPDDitolakList = getDataSPDDitolak(id_ms_login).then(responseSPDDitolak => { // id_ms_login_link_decrypt == null ? id_ms_login : id_ms_login_link_decrypt

            setDataSPDDitolak(responseSPDDitolak.result);
            loadjs();
        })
    }


    // Show modal SPD Ditolak detail
    function handleShow(jenis: string, nomor: string) {

        // Dijadikan seperti ini supaya pakai method GET
        nomor = nomor.replaceAll("/", "%2F");
        console.log(nomor)
        const docFlowStatus = getDokFlowStatusSpd(jenis, nomor).then(function (response) {
            setModalData(response.result);
        });

        setShow(true);

    }


    // Approve Direktur dan SPV (Tanpa Google Authentication)
    function handleTerima() {

        // let param = {
        //     id_ms_login: id_ms_login,
        //     dokumenKirimTerima: stateDoc
        // };

        // console.log(param)


        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan dikirim", "", "warning");
        } else {
            if (dataSPDDitolak?.dataKaryawan.iD_Ms_Jabatan == 2 || dataSPDDitolak?.dataKaryawan.iD_Ms_Jabatan == 3 ||
                dataSPDDitolak?.dataKaryawan.iD_Ms_Divisi == 16 || dataSPDDitolak?.dataKaryawan.iD_Ms_Divisi == 26) {

                var nomorDitujukan = "";
                stateDoc.forEach(element => {
                    if (element.flowType == "" || element.flowType == null) {
                        nomorDitujukan += element.nomor + "\n";
                    }
                });

                if (nomorDitujukan.length != 0) {
                    swal("Pilihan ditujukan harus diisi", "Nomor : \n" + nomorDitujukan, "info");
                } else {

                    let param = {
                        id_ms_login: id_ms_login,
                        dokumenKirimTerima: stateDoc
                    };

                    console.log(param)


                    var messageSuccess = "";
                    stateDoc.forEach(element => {
                        messageSuccess += element.nomor + "\n";
                    });

                    const kirimDokumenSPD = terimaDocSpd(param).then(function (response) {
                        if (response?.statusCode === 200 && response?.result == 200) {
                            swal("Berhasil terima dokumen!", "Nomor : \n" + messageSuccess, "success")
                                .then((value) => {
                                    window.location.reload();
                                });
                            loadData();

                        } else if (response?.result != "") {
                            swal("Gagal terima dokumen!", response?.result, "error");
                        } else {
                            swal("Gagal approve!", "", "error");
                        }
                    });
                }

            }
            else {
                swal("SPD hanya bisa dikirim oleh Manager / Direktur!", "", "info");
            }

        }
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


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>SPD Ditolak</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Dokumen Ditolak List</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="ibox-content">

                                    <div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Button variant="primary" onClick={() => handleTerima()}><i className="fa fa-check" aria-hidden="true"></i> Terima</Button>
                                            </div>

                                        </div>


                                    </div>
                                </div>

                                <div className="ibox-content">
                                    <div className="table-responsive">

                                        <div>
                                            <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                                className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />

                                            <h3>Selected row: {distictCount()}</h3>


                                            <br /><br /><br />
                                            <table id="mytableSort" className="table table-striped table-hover css-serial filterclass">
                                                <thead>
                                                    <tr className="showChecked">
                                                        <th className="bg-primary">#</th>
                                                        {/* <th className="bg-primary" style={{ display: "none" }}>Ordering</th> */}
                                                        <th className="text-right bg-primary">Detail</th>
                                                        {/* <th className="bg-primary">Doc</th> */}
                                                        <th className="bg-primary">Select</th>
                                                        <th className="bg-primary">Nomor</th>
                                                        <th className="bg-primary">PT</th>
                                                        <th className="bg-primary">Perihal</th>
                                                        <th className="bg-primary">Ditujukan</th>
                                                        <th className="bg-primary">Request By</th>
                                                        <th className="bg-primary">Request Time</th>
                                                        <th className="bg-primary">Sent Time</th>
                                                        <th className="bg-primary">Sent By</th>
                                                        <th className="bg-primary">Last Notes</th>

                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">
                                                    {dataSPDDitolak?.spdKirimTerimaList.map(data => (
                                                        <tr className={stateDocKey.includes(data.dokKey) ? "showChecked" : ""} style={{ backgroundColor: stateDocKey.includes(data.dokKey) ? "#FFCF8B" : "" }}>
                                                            <td></td>
                                                            {/* <td style={{ display: "none" }}>{stateDocKey.findIndex(x => x == data.docKey)}</td> */}
                                                            <td className="text-right">
                                                                <div className="btn-group">
                                                                    <Button variant="success"
                                                                        onClick={() => handleShow(data.jenis, data.nomor)}
                                                                    >
                                                                        <i className="fa fa-info" aria-hidden="true"></i>
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                            {/* <td>
                                                                <div className="btn-group">
                                                                    <Button variant={data.isDownload == "1" ? "success" : "danger"} disabled={data.isDownload == "1" ? false : true}
                                                                        onClick={() => handleDownload(data.id, data.nomor)} type="button"
                                                                    >
                                                                        <i className="fa fa-cloud-download" aria-hidden="true"></i>
                                                                    </Button>
                                                                </div>

                                                            </td> */}
                                                            <td className="text-center" key={data.dokKey}>
                                                                <label className="checkboxcontainer">
                                                                    <input
                                                                        value={data.dokKey}
                                                                        onChange={() => selectDoc(data, data.dokKey, "clicked")}
                                                                        type="checkbox"
                                                                        checked={stateDocKey.includes(data.dokKey) ? true : false}
                                                                    />

                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </td>
                                                            <td>{data.nomor}</td>
                                                            <td>{data.pt}</td>
                                                            <td>{data.perihal}</td>
                                                            <td>{data.flowType}</td>
                                                            <td>{data.requestByName}</td>
                                                            <td>{data.requestTimeStr}</td>
                                                            <td>{data.statusTimeStr}</td>
                                                            <td>{data.statusByName}</td>
                                                            <td>{data.lastNotes}</td>

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
            </div>

            <Modal
                show={show}
                size="xl"
                fullscreen="xl-down"
                onHide={handleClose}
                keyboard={false}
                scrollable={true}
            >
                <Modal.Header className="bg-primary">
                    <Modal.Title >
                        {/* Detail Unit {modalData?.jenisVRA} */}
                        Detail Status Dokumen
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="ibox ">
                                    <div className="ibox-title bg-primary">
                                        <h5>Detail Status Dokumen</h5>
                                    </div>
                                    <div className="ibox-content">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered table-hover dataTables" >
                                                <thead>
                                                    <tr>
                                                        <th className="bg-primary">Arrow</th>
                                                        <th className="bg-primary">Keterangan</th>
                                                        <th className="bg-primary">Tanggal</th>
                                                        <th className="bg-primary">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {modalData?.map((list =>
                                                        <tr key={list.id} className="gradeX">
                                                            {list.level === 0 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 1 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 2 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 3 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 4 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 5 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}

                                                            <td>{list.keterangan}</td>
                                                            <td>{list.tanggal}</td>
                                                            <td>{list.status}</td>
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
                </Modal.Body>
            </Modal>

        </>
    );
};

export default {
    routeProps: {
        path: '/finance/approval/dokumenspdditolak',
        exact: true,
        component: SPDDitolak
    },
    name: 'SPDDitolak',
};