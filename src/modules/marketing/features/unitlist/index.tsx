import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../../../stores/RootStore"; // RootStore Root
import { MarketingRootStoreContext } from "../../../marketing/stores/MarketingRootStore"; // RootStore Module
import { IApprovalPenjualanUnitDetail, IApprovalPenjualanUnitDetailDocument, IApprovalPenjualanUnitList } from "../../models/ApprovalPenjualanUnit";
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { getIdLogin, getUserAccess } from "../../../../utils/loginuseraccess";
import ButtonLoader from "../../../../component/button/buttonloader";
import swal from "sweetalert";

const UnitList = () => {
    const modulnames = 'marketing';
    const formName = 'Approval Outstanding Unit';

    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: Number = getIdLogin();

    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulnames, formName);

    const marketingRootStore = useContext(MarketingRootStoreContext)
    const {
        PenjualanUnitList,
        PenjualanUnitDetail,
        PenjualanUnitDetailDocument,
        PenjualanUnitApproveOrReject
    } = marketingRootStore.penjualanUnitStore;


    // Declare Array Result --> useState
    const [approvalOutstanding, setApprovalOutstanding] = useState<IApprovalPenjualanUnitList[]>([])

    // Set Disable Button
    const [disableButton, setDisableButton] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(0);

    // Set Function Sequence (Init)
    useEffect(() => {

        LoadData();

        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 1000);
        return () => clearTimeout(timer);

    }, []);

    // Load Init Data
    function LoadData() {
        const list = PenjualanUnitList(id_ms_login).then(function (response) {
            if (response?.statusCode === 200) {
                // Set useState Array
                setApprovalOutstanding(response.result);
            } else {
                // setMessage(response.message);
                // setStatus(response.statusCode);
            }
        });
    };

    //#region Modal Form

    // Declare value for hide / show Modal Form
    const [show, setShow] = useState(false);

    // Parameter for Modal Body ()    
    const [modalData, setModalData] = useState<IApprovalPenjualanUnitDetail>();
    const [nomor, setNomor] = useState(String);
    const [modalDoc, setModalDoc] = useState<IApprovalPenjualanUnitDetailDocument>();
    const [modalImage1, setModalImage1] = useState<IApprovalPenjualanUnitDetailDocument>();
    const [modalImage2, setModalImage2] = useState<IApprovalPenjualanUnitDetailDocument>();
    const [modalImage3, setModalImage3] = useState<IApprovalPenjualanUnitDetailDocument>();
    const [modalImage4, setModalImage4] = useState<IApprovalPenjualanUnitDetailDocument>();
    const [modalImage5, setModalImage5] = useState<IApprovalPenjualanUnitDetailDocument>();
    const [modalImage6, setModalImage6] = useState<IApprovalPenjualanUnitDetailDocument>();

    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);    

    async function handleShow(id: number, NomorPengajuan: string) {

        setNomor(NomorPengajuan);

        if (id !== 0) {
            const detail = PenjualanUnitDetail(id).then(function (response) {
                if (response?.statusCode === 200) {
                    setModalData(response?.result);
                }
            });

            const doc = PenjualanUnitDetailDocument(id, "UploadDoc").then(function (response) {
                if (response?.statusCode === 200) {
                    setModalDoc(response?.result);
                }
            });

            const img1 = PenjualanUnitDetailDocument(id, "UploadImage1").then(function (response) {
                if (response?.statusCode === 200) {
                    setModalImage1(response?.result);
                }
            });

            const img2 = PenjualanUnitDetailDocument(id, "UploadImage2").then(function (response) {
                if (response?.statusCode === 200) {
                    setModalImage2(response?.result);
                }
            });

            const img3 = PenjualanUnitDetailDocument(id, "UploadImage3").then(function (response) {
                if (response?.statusCode === 200) {
                    setModalImage3(response?.result);
                }
            });

            const img4 = PenjualanUnitDetailDocument(id, "UploadImage4").then(function (response) {
                if (response?.statusCode === 200) {
                    setModalImage4(response?.result);
                }
            });

            const img5 = PenjualanUnitDetailDocument(id, "UploadImage5").then(function (response) {
                if (response?.statusCode === 200) {
                    setModalImage5(response?.result);
                }
            });

            const img6 = PenjualanUnitDetailDocument(id, "UploadImage6").then(function (response) {
                if (response?.statusCode === 200) {
                    setModalImage6(response?.result);
                }
            });

            setShow(true);
        }
    }

    async function handleApprove(id: Number) {
        // Semua Form Data dalam bentuk String
        const formData = new FormData();
        formData.append("ID_Mar_PengajuanPenjualan", String(id));
        formData.append("ID_Ms_Login", String(id_ms_login));
        formData.append("Flag", "Approve");

        PenjualanUnitApproveOrReject(formData).then(function (response) {
            // setMessage(response.message)
            // setStatus(response.statusCode)

            if (response?.statusCode === 200) {
                setShow(false);
                LoadData();
                swal("Berhasil Approve!", "Nomor : " + nomor, "success");
            }
        });
    }

    async function handleReject(id: number) {
        // Semua Form Data dalam bentuk String
        const formData = new FormData();
        formData.append("ID_Mar_PengajuanPenjualan", String(id));
        formData.append("ID_Ms_Login", String(id_ms_login));
        formData.append("Flag", "Reject");

        PenjualanUnitApproveOrReject(formData).then(function (response) {
            // setMessage(response.message)
            // setStatus(response.statusCode)

            if (response?.statusCode === 200) {
                setShow(false);
                LoadData();
                swal("Berhasil Reject!", "Nomor : " + nomor, "success");
            }
        });
    }

    //#endregion Modal Form

    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Approval Outstanding Unit</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Approval Outstanding Unit List</h5>
                                </div>
                                <div className="ibox-content">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered table-hover dataTables" >
                                            <thead>
                                                <tr>
                                                    <th className="bg-primary">Nomor</th>
                                                    <th className="bg-primary">Tanggal</th>
                                                    <th className="bg-primary">Nomor Polisi</th>
                                                    <th className="bg-primary">Flag Jenis Unit</th>
                                                    <th className="bg-primary">Jenis Unit</th>
                                                    <th className="text-right bg-primary">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {approvalOutstanding.map((list =>
                                                    <tr key={list.id} className="gradeX">
                                                        <td>{list.nomor}</td>
                                                        <td>{list.tanggalPengajuan}</td>
                                                        <td>{list.nomorPolisi}</td>
                                                        <td>{list.flagJenisUnit}</td>
                                                        <td>{list.jenisUnit}</td>
                                                        <td className="text-right">
                                                            <div className="btn-group">
                                                                <Button variant="success"
                                                                    onClick={() => handleShow(list.id, list.nomor)}
                                                                >
                                                                    Detail
                                                                </Button>
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
                        Detail Unit {modalData?.jenisVRA}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Container>
                        {user_access[0][0].aksesupdate == "1" ?
                            <Row md={6}>
                                <Col md={2}>
                                    <ButtonLoader value={"Approve"}
                                        disabled={disableButton}
                                        onClick={() => handleApprove(modalData?.id!)}
                                    >Approve</ButtonLoader>
                                </Col>

                                <br />
                                <br />
                                <br />

                                <Col md={2}>
                                    <ButtonLoader value={"Reject"}
                                        disabled={disableButton}
                                        onClick={() => handleReject(modalData?.id!)}
                                    >Reject</ButtonLoader>
                                </Col>
                            </Row>

                            : ''
                        }

                        {/* <Row xs={2}>
                            <Col md={1}>
                                {user_access[0][0].aksesupdate == "1" ?
                                    <Button disabled={disableButton} variant="primary" onClick={() =>
                                        handleApprove(
                                            Number(modalData?.map(anObjectMapped => anObjectMapped.flag.split(" - ")[0])[0]),
                                            String(modalData?.map(anObjectMapped => anObjectMapped.flag.split(" - ")[1])[0]),
                                            String(modalData?.map(anObjectMapped => anObjectMapped.negosiator.split(" - ")[0])[0])
                                        )}>Approve</Button> : ''
                                }
                            </Col>

                            <br />
                            <br />
                            <br />

                            <Col md={1}>
                                {user_access[0][0].aksesupdate == "1" ? <Button disabled={disableButton} variant="danger"
                                    onClick={() =>
                                        handleReject(
                                            Number(modalData?.map(anObjectMapped => anObjectMapped.flag.split(" - ")[0])[0]),
                                            String(modalData?.map(anObjectMapped => anObjectMapped.flag.split(" - ")[1])[0]),
                                            String(modalData?.map(anObjectMapped => anObjectMapped.negosiator.split(" - ")[0])[0])
                                        )
                                    } >Reject</Button> : ''
                                }
                            </Col>
                        </Row> */}

                    </Container>

                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="ibox ">
                                    <div className="ibox-title bg-primary">
                                        <h5>Informasi Unit</h5>
                                    </div>
                                    <div className="ibox-content">
                                        {/* JENIS UNIT */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Jenis Unit</label>
                                            <div className="col-sm-6">
                                                {modalData?.jenisVRA}
                                            </div>
                                        </div>
                                        {/* KODE UNIT */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Jenis Unit</label>
                                            <div className="col-sm-6">
                                                {modalData?.kodeVRA}
                                            </div>
                                        </div>
                                        {/* NOMOR POLISI */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Nomor Polisi</label>
                                            <div className="col-sm-6">
                                                {modalData?.nomorPolisi}
                                            </div>
                                        </div>
                                        {/* TIPE */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Tipe Unit</label>
                                            <div className="col-sm-6">
                                                {modalData?.tipe}
                                            </div>
                                        </div>
                                        {/* MERK */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Merk</label>
                                            <div className="col-sm-6">
                                                {modalData?.merk}
                                            </div>
                                        </div>
                                        {/* NOMOR BPKB */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">BPKB</label>
                                            <div className="col-sm-6">
                                                {modalData?.nomorSTNK}
                                            </div>
                                        </div>
                                        {/* NOMOR MESIN */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Nomor Mesin</label>
                                            <div className="col-sm-6">
                                                {modalData?.nomorMesin}
                                            </div>
                                        </div>
                                        {/* NOMOR RANGKA */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Nomor Rangka</label>
                                            <div className="col-sm-6">
                                                {modalData?.nomorRangka}
                                            </div>
                                        </div>
                                        {/* NILAI ASSET */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Nilai Asset</label>
                                            <div className="col-sm-6">
                                                {modalData?.nilaiAsset}
                                            </div>
                                        </div>
                                        {/* NILAI BUKU */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Nilai Buku</label>
                                            <div className="col-sm-6">
                                                {modalData?.nilaiBuku}
                                            </div>
                                        </div>
                                        {/* PENGAJUAN PENJUALAN */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Pengajuan Penjualan</label>
                                            {/* <div className="col-sm-6">
                                                {modalData?.kodeVRA}
                                            </div> */}
                                        </div>
                                        {/* APPROVAL ACCOUNTING */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Tanggal Approval Accounting</label>
                                            <div className="col-sm-6">
                                                {modalData?.approveByAccounting}
                                            </div>
                                        </div>
                                        {/* TANGGAL APPROVAL SPV DEPT */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Tanggal Approval SPV Dept</label>
                                            <div className="col-sm-6">
                                                {modalData?.approveBySPVDept}
                                            </div>
                                        </div>
                                        {/* TANGGAL APPROVAL MANAGER DEPT */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Tanggal Approval Manager Dept</label>
                                            <div className="col-sm-6">
                                                {modalData?.approveByManagerDept}
                                            </div>
                                        </div>
                                        {/* DOKUMEN PENGAJUAN */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Dokumen Pengajuan</label>
                                            <img src={`data:image/jpeg;base64,${modalDoc?.fileData}`} width="500px" height="500px" />
                                        </div>
                                        {/* NOMOR RANGKA */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Foto Nomor Rangka</label>
                                            <img src={`data:image/jpeg;base64,${modalImage1?.fileData}`} width="500px" height="500px" />
                                        </div>
                                        {/* NOMOR MESIN */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Foto Nomor Mesin</label>
                                            <img src={`data:image/jpeg;base64,${modalImage2?.fileData}`} width="500px" height="500px" />
                                        </div>
                                        {/* MESIN */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Foto Mesin</label>
                                            <img src={`data:image/jpeg;base64,${modalImage3?.fileData}`} width="500px" height="500px" />
                                        </div>
                                        {/* TRANSMISI */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Foto Transmisi</label>
                                            <img src={`data:image/jpeg;base64,${modalImage4?.fileData}`} width="500px" height="500px" />
                                        </div>
                                        {/* GARDAN */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Foto Gardan</label>
                                            <img src={`data:image/jpeg;base64,${modalImage5?.fileData}`} width="500px" height="500px" />
                                        </div>
                                        {/* KESELURUHAN UNIT */}
                                        <div className="form-group  row">
                                            <label className="col-sm-2 col-form-label">Foto Unit</label>
                                            <img src={`data:image/jpeg;base64,${modalImage6?.fileData}`} width="500px" height="500px" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
        path: '/marketing/unit/list',
        exact: true,
        component: UnitList,
    },
    name: 'UnitList',
};
