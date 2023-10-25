import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { getGroupName, getIdLogin, getUserAccess } from "../../../../utils/loginuseraccess";
import SyncLoader from "react-spinners/SyncLoader";
import PropagateLoader from "react-spinners/PropagateLoader";
import { FinanceRootStoreContext } from "../../stores/FinanceRootStore";
import { BKUDetailOPLPB, IBKUList } from "../../models/ApprovalBKUModel";
import { Field, Form } from "react-final-form";
import React from "react";
import ButtonLoader from "../../../../component/button/buttonloader";
import { useLocation } from "react-router-dom";
import { decryptData } from '../../../../utils/encrypt';


const ApprovalBKU = () => {
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'Approval BKU';

    const [dataBKU, setDataBKU] = useState<IBKUList[]>([]);
    const [modalData, setModalData] = useState<BKUDetailOPLPB>();

    const [showModalAuth, setShowModalAuth] = useState(false);
    const [showModalComment, setShowModalComment] = useState(false);
    const handleCloseModalAuth = () => setShowModalAuth(false);
    const handleCloseModalComment = () => setShowModalComment(false);


    const [show, setShow] = useState(false);
    const [stateNomor, setNomor] = useState("");
    const [stateKeterangan, setKeterangan] = useState("");
    const [stateKetRekening, setKetRekening] = useState("");

    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataBKU, getDataBKUDetail, approveBKU, getCheckDataBKUDownloaded } = financeRootStore.approvalBKUStore;

    var id = new URLSearchParams(useLocation().search);
    const id_ms_login_link = id.get("idlg");

    // const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    // const id_ms_login_link_decrypt = decryptData(String(id_ms_login_link), salt);


    const handleClose = () => {
        setTimeout(() => {
            document.getElementById("btnshowblur")?.blur();
        }, 300)

        setTimeout(() => {
            document.getElementById("focusinput")?.focus();
        }, 300)

        setShow(false);
    }


    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: Number = getIdLogin();
    const groupName: String = getGroupName();


    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulname, formName);


    // Select Multiple Doc
    let anchorCheck = document.getElementById("showCheckedRowButton");
    let anchorSort = document.getElementById("sortButton");
    const [stateDocKey, setstateDocKey] = useState<Array<string>>([]);

    const selectDoc = (selectedId: string, acctionMethod: string) => {

        if (stateDocKey.includes(selectedId)) {
            const newDocKey = stateDocKey.filter((id) => id !== selectedId);
            setstateDocKey(newDocKey);
        }
        else {
            const newDocKey = [...stateDocKey];
            var replacedString = selectedId.replace("\r", "");

            newDocKey.push(replacedString);
            setstateDocKey(newDocKey);

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

    // setInterval(clickTrigger, 5000);

    // function clickTrigger() {
    //     document.getElementById("showCheckedRowButton")?.click();
    // }



    useEffect(() => {

        var docKeyString = "";
        function handleKeyPress(event: { keyCode: any; which: any; }) {
            docKeyString += String.fromCharCode(event.which)

            if (event.keyCode === 13) {
                selectDoc(docKeyString, "pressed");
                docKeyString = "";
            }
        }

        window.addEventListener('keypress', handleKeyPress);

        // refresh data setelah transaksi 
        loadData();
        loadjs();

        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        }

    }, [stateDocKey]);


    function loadjs() {
        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 500);
        return () => {
            clearTimeout(timer);
        }
    }


    // Load data list BKU dan Akun
    function loadData() {
        const BKUList = getDataBKU(id_ms_login).then(function (response) { // id_ms_login_link_decrypt == null ? id_ms_login : id_ms_login_link_decrypt
            if (response.statusCode === 200) {
                setDataBKU(response.result);
                loadjs();
            }
        })
    }


    // Show modal BKU detail 
    const [loadingDataModal, setLoadingDataModal] = useState(true);

    function handleShow(nomor: string, keterangan: string, ketRekening: string) {

        // Dijadikan seperti ini supaya pakai method GET
        nomor = nomor.replaceAll("/", "%2F");

        setLoadingDataModal(true);

        const detailBKU = getDataBKUDetail(nomor).then(function (response) {
            if (response.statusCode === 200) {
                setModalData(response.result);
                setLoadingDataModal(false);
            }
        });

        setShow(true);

        setKeterangan(keterangan);
        setKetRekening(ketRekening);
        setNomor(nomor);

    }


    // Approve BKU
    function googleAuthModal() {

        // Handle Check download document
        let param = {
            ID_Ms_Login: id_ms_login,
            docKey: stateDocKey
        };

        console.log(param)

        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan diapprove", "", "warning");
        } else {
            const checkDownloadedBKU = getCheckDataBKUDownloaded(param).then(function (response) {
                if (response.statusCode === 200) {
                    console.log(response.result);
                    if (response.result === "ReadyToApprove") {
                        setShowModalAuth(true);
                    } else {
                        swal("Mohon Download Dokumen!", response?.result, "warning");
                    }
                }
            });

        }
    }


    // Reject Commnet Modal
    function rejectCommentModal() {

        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan direject", "", "warning");
        } else {
            setShowModalComment(true);
        }
    }


    // Approve manager dengan Google Authentication
    const handleFinalFormSubmitApprove = (values: any) => {

        const { ...dataApprove } = values;

        // Handle Approve
        let param = {
            // ID_Ms_Login_Replacement: id_ms_login_link_decrypt !== null ? id_ms_login_link_decrypt : 0,
            ID_Ms_Login: id_ms_login,
            JabatanFlag: groupName.toUpperCase(),
            AuthCodeFromPhone: dataApprove.authenticationcode,
            docKey: stateDocKey,
            ApprovalFlag: "Approve"
        };

        console.log(param)
        

        const distinctDocKey: string[] = [];
        stateDocKey.map(data => {
            if (distinctDocKey.indexOf(data) === -1) {
                distinctDocKey.push(data)
            }
        });

        var messageSuccess = "";
        distinctDocKey.forEach(element => {
            const convertedDocKey = ConvertToNomor(element);
            messageSuccess += convertedDocKey + "\n";
        });

        const approvalBKU = approveBKU(param).then(function (response) {
            if (response?.statusCode === 200 && response?.result === "ApprovedBySPVOrManager") {
                swal("Berhasil approve!", "Nomor : \n" + messageSuccess, "success").then((value) => {
                    window.location.reload();
                });
                setShowModalAuth(false);
                loadData();
            } else if (response?.statusCode === 200 && response?.result === "WrongPin") {
                swal("Gagal approve!", "Pin salah", "error");
            } else if (response?.statusCode === 200 && response?.result === "AllApproved") {
                swal("Berhasil approve!", "", "success").then((value) => {
                    window.location.reload();
                });
                setShowModalAuth(false);
                loadData();
            } else {
                swal("Gagal approve!", "", "error");
            }
        });

    }



    // Reject dokumen BKU
    const handleFinalFormSubmitReject = (values: any) => {

        const { ...dataReject } = values;

        // Handle Reject
        let param = {
            ID_Ms_Login: id_ms_login,
            RejectionComment: dataReject.commentreject,
            docKey: stateDocKey,
            ApprovalFlag: "Reject"
        };

        var messageSuccess = "";
        stateDocKey.forEach(element => {
            const convertedDocKey = ConvertToNomor(element);
            messageSuccess += convertedDocKey + "\n";
        });

        const approvalBKU = approveBKU(param).then(function (response) {
            if (response?.statusCode === 200 && response?.result === "RejectedByManager") {
                swal("Berhasil Reject!", "Nomor : \n" + messageSuccess, "success");
                setShowModalComment(false);
                loadData();
            } else {
                swal("Gagal Reject!", "", "error");
            }
        });

    }


    // Approve SPV
    function handleApprove() {

        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan diapprove", "", "warning");
        } else {

            let paramCekDownloadDoc = {
                ID_Ms_Login: id_ms_login,
                docKey: stateDocKey
            };

            const checkDownloadedBKU = getCheckDataBKUDownloaded(paramCekDownloadDoc).then(function (res) {
                if (res.statusCode === 200) {
                    console.log(res.result);
                    if (res.result === "ReadyToApprove") {

                        let param = {
                            // ID_Ms_Login_Replacement: id_ms_login_link_decrypt !== null ? id_ms_login_link_decrypt : 0,
                            ID_Ms_Login: id_ms_login,
                            JabatanFlag: groupName.toUpperCase(),
                            docKey: stateDocKey,
                            ApprovalFlag: "ApprovalSPVDirCEO"
                        };

                        console.log(param)


                        const distinctDocKey: string[] = [];
                        stateDocKey.map(data => {
                            if (distinctDocKey.indexOf(data) === -1) {
                                distinctDocKey.push(data)
                            }
                        });

                        var messageSuccess = "";
                        distinctDocKey.forEach(element => {
                            const convertedDocKey = ConvertToNomor(element);
                            messageSuccess += convertedDocKey + "\n";
                        });

                        const approvalBKU = approveBKU(param).then(function (response) {
                            var asd = response;
                            if (response?.statusCode === 200 && response?.result === "ApprovedBySPVOrManager") {
                                swal("Berhasil approve!", "Nomor : \n" + messageSuccess, "success")
                                    .then((value) => {
                                        window.location.reload();
                                    });
                                loadData();

                            } else if (response?.statusCode === 200 && response?.result.includes("ApprovedBySPVOrManager|")) {
                                swal("Berhasil approve!", "WARNING! NOMOR BERIKUT TIDAK DIAPPROVE KARENA TIDAK ADA DALAM LIST: \n" + response?.result.split("|")[1] + "\n\n" + "Nomor : \n" + messageSuccess, "success").then((value) => {
                                    window.location.reload();
                                });
                                loadData();
                            } else if (response?.statusCode === 200 && response?.result === "AllApproved") {
                                swal("Berhasil approve!", "", "success").then((value) => {
                                    window.location.reload();
                                });
                                loadData();
                            } else {
                                swal("Gagal approve!", "", "error");
                            }
                        });
                    } else {
                        swal("Mohon Download Dokumen!", res?.result, "warning");
                    }
                }
            });


        }
    }


    // Approve Direktur
    function handleApproveDir() {

        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen yang akan diapprove", "", "warning");
        } else {

            let param = {
                // ID_Ms_Login_Replacement: id_ms_login_link_decrypt !== null ? id_ms_login_link_decrypt : 0,
                ID_Ms_Login: id_ms_login,
                JabatanFlag: groupName.toUpperCase(),
                docKey: stateDocKey,
                ApprovalFlag: "ApprovalSPVDirCEO"
            };

            console.log(param)

            const distinctDocKey: string[] = [];
            stateDocKey.map(data => {
                if (distinctDocKey.indexOf(data) === -1) {
                    distinctDocKey.push(data)
                }
            });

            var messageSuccess = "";
            distinctDocKey.forEach(element => {
                const convertedDocKey = ConvertToNomor(element);
                messageSuccess += convertedDocKey + "\n";
            });

            const approvalBKU = approveBKU(param).then(function (response) {
                var asd = response;
                if ( response?.statusCode === 200 ) { // response?.result === "ApprovedByDirektur"
                    swal("Berhasil approve!", "Nomor : \n" + messageSuccess, "success")
                        .then((value) => {
                            window.location.reload();
                        });
                    loadData();

                } else {
                    swal("Gagal approve!", "", "error");
                }
            });

        }
    }


    // Download dokumen SPD
    function handleDownload(id_fn_bku: number, filename: any) {

        const token = window.localStorage.getItem('token');
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = `http://192.168.1.121:9009/api/ApprovalBKU/downloadbkuapprv/${id_fn_bku}/${id_ms_login}`;  //http://192.168.1.121:9009/  //https://localhost:6009/

        let headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);

        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                let objectUrl = window.URL.createObjectURL(blobby);

                anchor.href = objectUrl;
                anchor.download = filename;
                anchor.click();

                window.URL.revokeObjectURL(objectUrl);
            });

        setTimeout(() => {
            document.getElementById("btndownloadblur")?.blur();
        }, 300)

        setTimeout(() => {
            document.getElementById("focusinput")?.focus();
        }, 300)

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

    function ConvertToNomor(docKey: string) {

        const nomor = docKey;
        const length = nomor.length;
        let fullNomor = "";
        const separator = "/";

        if (length == 17) {
            const bagian = nomor.substring(0, 3);
            const pt = nomor.substring(5, 3);
            const form = nomor.substring(8, 5);

            const year = nomor.substring(10, 8);
            const month = nomor.substring(12, 10);
            const last5digits = nomor.substring(17, 12);

            fullNomor = bagian + separator + pt + separator + form + separator + year + separator + month + separator + last5digits;
        } else {
            const bagian = nomor.substring(0, 3);
            const pt = nomor.substring(6, 3);
            const form = nomor.substring(9, 6);

            const year = nomor.substring(11, 9);
            const month = nomor.substring(13, 11);
            const last5digits = nomor.substring(18, 13);

            fullNomor = bagian + separator + pt + separator + form + separator + year + separator + month + separator + last5digits;
        }

        return fullNomor;
    }

    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Approval BKU</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Approval BKU List</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="ibox-content">

                                    <div>
                                        {id_ms_login == 57 || id_ms_login == 93 || groupName.toUpperCase().includes("MANAGER") ? //  id_ms_login_link_decrypt == 57 || id_ms_login_link_decrypt == 93
                                            <div className="row">
                                                <div className="col-md-2">
                                                    <Button variant="primary" onClick={() => googleAuthModal()}>Approve</Button>
                                                </div>

                                                <br />
                                                <br />

                                                <div className="col-md-2">
                                                    <Button variant="danger" onClick={() => rejectCommentModal()}>Reject</Button>
                                                </div>


                                                <br />
                                                <br />

                                                <div className="col-md-4">
                                                    <Button variant="secondary" id="showCheckedRowButton">Show Checked Row Only</Button>
                                                    <Button variant="secondary" id="showAll" style={{ display: "none" }}>Show All Row</Button>
                                                    <Button id="sortButton" style={{ display: "none" }}>Sort</Button>
                                                </div>
                                            </div>

                                            :

                                            <div className="row">

                                                <div className="col-md-2">
                                                    {id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ?
                                                        <Button className="ladda-button" variant="primary" onClick={() => handleApproveDir()}>Approve</Button>
                                                        :
                                                        <Button className="ladda-button" variant="primary" onClick={() => handleApprove()}>Approve</Button>
                                                    }
                                                </div>

                                                <br />
                                                <br />

                                                <div className="col-md-4">
                                                    <Button variant="secondary" id="showCheckedRowButton">Show Checked Row Only</Button>
                                                    <Button variant="secondary" id="showAll" style={{ display: "none" }}>Show All Row</Button>
                                                    <Button id="sortButton" style={{ display: "none" }}>Sort</Button>
                                                </div>
                                            </div>


                                        }

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
                                                        <th className="bg-primary" style={{ display: "none" }}>Ordering</th>
                                                        <th className="text-right bg-primary">Detail</th>
                                                        <th className="bg-primary">Doc</th>
                                                        <th className="bg-primary">Select</th>
                                                        <th className="bg-primary">Nomor</th>
                                                        <th className="bg-primary">Tanggal</th>
                                                        <th className="bg-primary">Supplier</th>
                                                        <th className="bg-primary">Cara</th>
                                                        <th className="bg-primary">Rekening</th>
                                                        <th className="bg-primary">Nilai</th>
                                                        <th className="bg-primary">Keterangan</th>
                                                        {id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ?
                                                            <th className="bg-primary">Status</th>
                                                            : ''
                                                        }

                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">
                                                    {dataBKU.map(data => (
                                                        <tr className={stateDocKey.includes(data.docKey) ? "showChecked" : ""} style={{ backgroundColor: stateDocKey.includes(data.docKey) ? "#FFCF8B" : "" }}>
                                                            <td></td>
                                                            <td style={{ display: "none" }}>{stateDocKey.findIndex(x => x == data.docKey)}</td>
                                                            <td className="text-right">
                                                                <div className="btn-group">
                                                                    <Button variant="success" id="btnshowblur"
                                                                        onClick={() => handleShow(data.nomor, data.keterangan, data.ketRekening)}
                                                                    >
                                                                        <i className="fa fa-info" aria-hidden="true"></i>
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="btn-group">
                                                                    <Button id="btndownloadblur" variant={data.isDownload == "1" ? "success" : "danger"} disabled={data.isDownload == "1" ? false : true}
                                                                        onClick={() => handleDownload(data.id, data.nomor)} type="button"
                                                                    >
                                                                        <i className="fa fa-cloud-download" aria-hidden="true"></i>
                                                                    </Button>
                                                                </div>

                                                            </td>
                                                            <td className="text-center" key={data.docKey}>
                                                                <label className="checkboxcontainer">
                                                                    <input
                                                                        value={data.docKey}
                                                                        onChange={() => selectDoc(data.docKey, "clicked")}
                                                                        type="checkbox"
                                                                        checked={stateDocKey.includes(data.docKey) ? true : false}
                                                                        id="focusinput"
                                                                    />

                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </td>
                                                            <td>{data.nomor}</td>
                                                            <td>{data.tanggalStr}</td>
                                                            <td>{data.supplier}</td>
                                                            <td>{data.cara}</td>
                                                            <td>{data.ketRekening}</td>
                                                            <td className="text-right">{formatPrice(data.nilai)}</td>
                                                            <td>{data.keterangan}</td>
                                                            {id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ?
                                                                <td>{data.status}</td>
                                                                : ''
                                                            }


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


            <Modal show={show} size="xl" fullscreen="xl-down" onHide={handleClose} keyboard={false} scrollable={true}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title> Detail BKU - {modalData?.bkuDetail[0].nomor} </Modal.Title>
                </Modal.Header>


                {
                    loadingDataModal == true ?

                        <div className="text-center">
                            <div style={{ padding: "100px" }}>
                                <SyncLoader color={"#1ab394"} loading={loadingDataModal} />
                            </div>

                        </div>

                        :

                        <Modal.Body>

                            <Container>
                                <Row>
                                    <Col md={6}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "17px" }} className="badge-primary rounded">
                                            <b>Total: {formatPrice(modalData?.bkuDetail[0].total!)}</b>
                                        </p>
                                    </Col>
                                </Row>

                            </Container>

                            <br />
                            <br />

                            <div className="container">
                                <table className="table table-striped table-bordered table-hover css-serial" >
                                    <thead>
                                        <tr>
                                            <th className="bg-primary">#</th>
                                            <th className="bg-primary">Kode COA</th>
                                            <th className="bg-primary">Nama COA</th>
                                            <th className="bg-primary">Harga</th>
                                            <th className="bg-primary">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalData?.bkuDetail.map(bkudetail => (
                                            <tr className="gradeX">
                                                <td></td>
                                                <td>{bkudetail.kodeAkun}</td>
                                                <td>{bkudetail.namaAkun}</td>
                                                <td className="text-right">{formatPrice(bkudetail.harga)}</td>
                                                <td>{bkudetail.detail}</td>

                                            </tr>
                                        ))}


                                    </tbody>
                                </table>

                            </div>


                            <Container>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary rounded">
                                            <b>REKENING : {stateKetRekening == null ? '' : stateKetRekening.toUpperCase()}</b>
                                        </p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary">
                                            <b>KETERANGAN : {stateKeterangan.toUpperCase()}</b>
                                        </p>
                                    </Col>
                                </Row>

                            </Container>


                            <div className="container">
                                <table className="table table-striped table-bordered table-hover css-serial" >
                                    <thead>
                                        <tr>
                                            <th className="bg-primary">#</th>
                                            <th className="bg-primary">Nomor OP</th>
                                            <th className="bg-primary">Tanggal OP</th>
                                            <th className="bg-primary">Nomor LPB</th>
                                            <th className="bg-primary">Tanggal LPB</th>
                                            <th className="bg-primary">Tagihan</th>
                                            <th className="bg-primary">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalData?.bkuOpLpbDetail.map((bkuoplpbdetail, idx) => (
                                            <tr className="gradeX">
                                                <td>{idx + 1}</td>
                                                <td>{bkuoplpbdetail.nomorOP}</td>
                                                <td>{bkuoplpbdetail.tanggalOP}</td>
                                                <td>{bkuoplpbdetail.nomorLPB}</td>
                                                <td>{bkuoplpbdetail.tanggalLPB}</td>
                                                <td className="text-right">{bkuoplpbdetail.tagihan}</td>
                                                <td>{bkuoplpbdetail.type}</td>

                                            </tr>
                                        ))}


                                    </tbody>
                                </table>

                            </div>

                            <Container>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary rounded">
                                            <b>Approval SPV Finance : {modalData?.bkuDetailHistory == null ? '-' : modalData?.bkuDetailHistory.approvalSPVFinance == null ? '-' : modalData?.bkuDetailHistory.approvalSPVFinance}</b>
                                        </p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary">
                                            <b>Approval Manager Finance : {modalData?.bkuDetailHistory == null ? '-' : modalData?.bkuDetailHistory.approvalManagerFinance == null ? '-' : modalData?.bkuDetailHistory.approvalManagerFinance}</b>
                                        </p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary rounded">
                                            <b>Approval Manager BNC : {modalData?.bkuDetailHistory == null ? '-' : modalData?.bkuDetailHistory.approvalManagerBNC == null ? '-' : modalData?.bkuDetailHistory.approvalManagerBNC}</b>
                                        </p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary">
                                            <b>Approval Dir 1 : {modalData?.bkuDetailHistory == null ? '-' : modalData?.bkuDetailHistory.approvalDir1 == null ? '-' : modalData?.bkuDetailHistory.approvalDir1}</b>
                                        </p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary rounded">
                                            <b>Approval Dir 2 : {modalData?.bkuDetailHistory == null ? '-' : modalData?.bkuDetailHistory.approvalDir2 == null ? '-' : modalData?.bkuDetailHistory.approvalDir2}</b>
                                        </p>
                                    </Col>
                                </Row>

                            </Container>

                        </Modal.Body>
                }

                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <Modal
                show={showModalAuth}
                onHide={handleCloseModalAuth}
                centered
            >
                <Modal.Header closeButton className="bg-success">
                    <Modal.Title id="contained-modal-title-vcenter">
                        Google Authentication
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">

                        <h3>Masukkan Kode Autentikasi</h3>
                        <Form
                            onSubmit={handleFinalFormSubmitApprove}
                            validate={(values: { authenticationcode: any; }) => {
                                const errors: any = {};
                                if (!values.authenticationcode) {
                                    errors.authenticationcode = "Google authentication code is required";
                                }
                                return errors;
                            }}
                            render={({ handleSubmit }) => (
                                <form className="m-t" method="POST" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <Field name="authenticationcode">
                                            {({ input, meta }) => {
                                                return (
                                                    <React.Fragment>

                                                        <input autoComplete="off" {...input} type="text"
                                                            className="form-control text-center col-md-4 offset-md-4"
                                                            placeholder="Google Auth Key" />

                                                        <div className="text-danger">
                                                            {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            }}
                                        </Field>
                                    </div>

                                    <br /><br />

                                    <button type="submit" className="ladda-button btn btn-primary block full-width m-b" data-style="zoom-in" >Approve</button>
                                    <a href="#">
                                        <small></small>
                                    </a>
                                </form>
                            )}
                        />

                    </div>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>


            <Modal
                show={showModalComment}
                onHide={handleCloseModalComment}
                centered
            >
                <Modal.Header closeButton className="bg-success">
                    <Modal.Title id="contained-modal-title-vcenter">
                        Rejection Comment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">

                        <h3>Alasan Reject</h3>
                        <Form
                            onSubmit={handleFinalFormSubmitReject}
                            validate={(values: { commentreject: any; }) => {
                                const errors: any = {};
                                if (!values.commentreject) {
                                    errors.commentreject = "Comment is required";
                                }
                                return errors;
                            }}
                            render={({ handleSubmit }) => (
                                <form className="m-t" method="POST" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <Field name="commentreject">
                                            {({ input, meta }) => {
                                                return (
                                                    <React.Fragment>

                                                        <textarea {...input} autoComplete="off"
                                                            className="form-control" placeholder="Comment.." rows={4} />

                                                        <div className="text-danger">
                                                            {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            }}
                                        </Field>
                                    </div>

                                    <br /><br />

                                    <button type="submit" className="ladda-button btn btn-danger block full-width m-b" data-style="zoom-in" >Reject</button>
                                    <a href="#">
                                        <small></small>
                                    </a>
                                </form>
                            )}
                        />

                    </div>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default {
    routeProps: {
        path: '/finance/approval/approvalbku',
        exact: true,
        component: ApprovalBKU
    },
    name: 'ApprovalBKU',
};