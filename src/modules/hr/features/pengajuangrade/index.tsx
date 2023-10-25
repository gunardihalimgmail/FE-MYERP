import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import SyncLoader from "react-spinners/SyncLoader";
import { Field, Form } from "react-final-form";
import React from "react";
import { RootStoreContext } from "../../../../../src/stores/RootStore";
import { HRRootStoreContext } from "../../../hr/stores/HRRootStore";
import { IPengajuanGradeList, IPengajuanGradeKaryawanDetail } from "../../models/ApprovalGradeModel";
import { getIdLogin } from "../../../../utils/loginuseraccess";

const ApprovalGrade = () => {
    const modulname = 'hr'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'Approval Grade';

    const hrRootStore = useContext(HRRootStoreContext);
    const {
        ListPengajuanGrade,
        DetailPengajuanGradeKaryawan,
        UpdateApprovalGrade
    } = hrRootStore.pengajuanGradeStore;

    const rootStore = useContext(RootStoreContext);

    // State
    // Init Data
    const [listPengajuanGrade, setListPengajuanGrade] = useState<IPengajuanGradeList[]>([]);
    // Declare value for hide / show Modal Form
    const [show, setShow] = useState(false);
    // Set State for Details
    // const [nomor, setNomor] = useState(String);
    const [modalData, setModalData] = useState<IPengajuanGradeKaryawanDetail[]>([]);

    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: number = getIdLogin();

    // // Decrypt menu untuk get user akses
    // const user_access: any = getUserAccess(modulname, formName);

    useEffect(() => {
        LoadData();
        loadjs();
        
    }, []);

    
    function loadjs() {
        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 200);
        return () => {
            // window.removeEventListener("keypress", handleKeyPress);
            clearTimeout(timer);
        }
    }

    function LoadData() {
        const list = ListPengajuanGrade().then(function (response) {
            if (response?.statusCode === 200) {

                console.log(response.result);
                // Set useState Array
                setListPengajuanGrade(response.result);
                loadjs();
            }
        });
    }

    const handleClose = () => setShow(false);

    function handleShow(id: number) {
        try {
            const detail = DetailPengajuanGradeKaryawan(id).then(function (response) {
                if (response?.statusCode === 200) {
                    setModalData(response.result);
                } else {
                    swal("Data Error", "", "warning");
                }
            });
        } catch (error) {
            swal("Mohon pilih dokumen yang akan diapprove", "", "warning");
        }

        setShow(true);
    }

    const [stateDocKey, setStateDocKey] = useState<Array<string>>([]);
    const [stateDoc, setStateDoc] = useState<Array<IPengajuanGradeKaryawanDetail>>([]);

    const selectDoc = (documentSelected: any, selectedId: string) => {

        // selectedId = nomorKaryawan
        // karena tidak bisa passing int

        if (stateDocKey.includes(selectedId)) {
            const newDocKey = stateDocKey.filter((id) => id !== selectedId);
            const newDoc = stateDoc.filter((id) => id !== documentSelected);
            setStateDocKey(newDocKey);
            setStateDoc(newDoc);
        }
        else {
            const newDocKey = [...stateDocKey];
            const newDoc = [...stateDoc];

            newDocKey.push(selectedId);
            newDoc.push(documentSelected);
            setStateDocKey(newDocKey);
            setStateDoc(newDoc);
        }
    };

    // function addNotes(strNotes: string, dokumenSpd: any) {
    function addNotes(strNotes: string, stateDoc: any) {
        // dokumenSpd.keterangan = strNotes
        stateDoc.keterangan = strNotes
    }

    function handleApprove() {
        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen", "", "warning");
        } else {
            let param = {
                id_ms_login: id_ms_login,
                flag: "Approve",
                approveGradeKaryawan: stateDoc
            };

            console.log(param);

            UpdateApprovalGrade(param).then(function (response) {
                if (response?.statusCode === 200) {
                    setShow(false);
                    window.location.reload();
                    LoadData();
                    swal("Berhasil Approve Grade!");
                } else if (response?.statusCode === 200 && response?.result != "") {
                    swal("Gagal Approve!", response?.result, "error");
                } else {
                    swal("Gagal Approve!", "", "error");
                }
            });
        }
    }

    function handleReject() {
        if (stateDocKey.length == 0) {
            swal("Mohon pilih dokumen", "", "warning");
        } else {
            let param = {
                id_ms_login: id_ms_login,
                flag: "Reject",
                approveGradeKaryawan: stateDoc
            };

            console.log(param);

            UpdateApprovalGrade(param).then(function (response) {
                if (response?.statusCode === 200) {
                    setShow(false);
                    window.location.reload();
                    LoadData();
                    swal("Berhasil Reject Grade!");
                } else if (response?.statusCode === 200 && response?.result != "") {
                    swal("Gagal Reject!", response?.result, "error");
                } else {
                    swal("Gagal Reject!", "", "error");
                }
            });
        }
    }

    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>List Pengajuan Grade</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Approval Pengajuan Grade</h5>
                                </div>
                                <div className="ibox-content">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered table-hover dataTables" >
                                            <thead>
                                                <tr>
                                                    <th className="text-right bg-primary">Action</th>
                                                    <th className="bg-primary">PT</th>
                                                    <th className="bg-primary">Tahun</th>
                                                    <th className="bg-primary">Bulan</th>
                                                    <th className="bg-primary">Nomor Surat</th>
                                                    <th className="bg-primary">Request By</th>
                                                    <th className="bg-primary">Tanggal</th>
                                                    <th className="bg-primary">Keterangan</th>
                                                    <th className="bg-primary">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listPengajuanGrade.map((list =>
                                                    <tr key={list.id} className="gradeX">
                                                        <td className="text-right">
                                                            <div className="btn-group">
                                                                <Button variant="success"
                                                                    onClick={() => handleShow(list.id)}
                                                                >
                                                                    <i className="fa fa-info" aria-hidden="true"></i>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                        <td>{list.kodePT}</td>
                                                        <td>{list.tahun}</td>
                                                        <td>{list.bulan}</td>
                                                        <td>{list.nomorSurat}</td>
                                                        <td>{list.userRequest}</td>
                                                        <td>{list.tanggalRequestStr}</td>
                                                        <td>{list.keterangan}</td>
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
                        {/* Nomor Pengajuan {modalData?.nomorSurat} */}
                        Detail Pengajuan Grade - {modalData[0]?.nomorSurat}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row md={6}>
                            <Col md={2}>
                                <Button variant="success"
                                    onClick={() => handleApprove()}
                                >Approve</Button>
                            </Col>

                            <br />
                            <br />
                            <br />

                            <Col md={2}>
                                <Button variant="danger"
                                    onClick={() => handleReject()}
                                >Reject</Button>
                            </Col>
                        </Row>
                    </Container>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="ibox ">
                                    <div className="ibox-title bg-primary">
                                        <h5>Informasi Karyawan</h5>
                                    </div>
                                    <div className="ibox-content">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered table-hover dataTables" >
                                                <thead>
                                                    <tr>
                                                        <th className="bg-primary">Action</th>
                                                        <th className="bg-primary">NIK</th>
                                                        <th className="bg-primary">Nama Karyawan</th>
                                                        <th className="bg-primary">TMK</th>
                                                        <th className="bg-primary">PT</th>
                                                        <th className="bg-primary">PT Req</th>
                                                        <th className="bg-primary">Jabatan Asal</th>
                                                        <th className="bg-primary">Jabatan Req</th>
                                                        <th className="bg-primary">Grade Asal</th>
                                                        <th className="bg-primary">Grade Req</th>
                                                        <th className="bg-primary">JK</th>
                                                        <th className="bg-primary">JK Req</th>
                                                        <th className="bg-primary">Departemen</th>
                                                        <th className="bg-primary">Departemen Req</th>
                                                        <th className="bg-primary">Divisi</th>
                                                        <th className="bg-primary">Divisi Req</th>
                                                        <th className="bg-primary">Golongan</th>
                                                        <th className="bg-primary">Golongan Req</th>
                                                        <th className="bg-primary">Keterangan</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {modalData.map((list =>
                                                        // <tr key={list.id_Ms_ReqUpdateGradeDetail} className="gradeX">
                                                        <tr className="gradeX">
                                                            <td className="text-center"
                                                                key={list.id_Ms_ReqUpdateGradeDetail}
                                                            >
                                                                <label className="checkboxcontainer">
                                                                    <input
                                                                        value={list.nomorKaryawan}
                                                                        onChange={() => selectDoc(list, list.nomorKaryawan)}
                                                                        checked={stateDocKey.includes(list.nomorKaryawan) ? true : false}
                                                                        type="checkbox"
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </td>
                                                            <td>{list.nomorKaryawan}</td>
                                                            <td>{list.namaKaryawan}</td>
                                                            <td>{list.tanggalBergabung}</td>
                                                            <td>{list.unitUsahaApp}</td>
                                                            <td>{list.unitUsahaReq}</td>
                                                            {/* <td>{list.jabatanApp}</td> */}
                                                            <td>{list.jabatan}</td>
                                                            <td>{list.jabatanReq}</td>
                                                            {/* <td>{list.tingkatanUpahApp}</td> */}
                                                            <td>{list.tingkatanUpahLast}</td>
                                                            <td>{list.tingkatanUpahReq}</td>
                                                            <td>{list.jenisKaryawanApp}</td>
                                                            <td>{list.jenisKaryawanReq}</td>
                                                            <td>{list.departemenApp}</td>
                                                            <td>{list.departemenReq}</td>
                                                            <td>{list.divisiApp}</td>
                                                            <td>{list.divisiReq}</td>
                                                            <td>{list.golonganApp}</td>
                                                            <td>{list.golonganReq}</td>
                                                            <td className="text-center">
                                                                <label className="textboxcontainer">
                                                                    <input id="fnote" className="form-control"
                                                                        onBlur={event => addNotes(event.target.value, list)}
                                                                        type="text"
                                                                    />
                                                                </label>
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
                </Modal.Body>
                <Modal.Footer>
                    <div></div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default {
    routeProps: {
        path: '/hr/approval/approvalgrade',
        exact: true,
        component: ApprovalGrade,
    },
    name: 'ApprovalGrade',
};
