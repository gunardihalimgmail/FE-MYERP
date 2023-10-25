import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import ReactDOM from "react-dom";
import ButtonLoader from "../../../../component/button/buttonloader";
import { BKUDetailAndIsDownload, IAkunList, IBKUDetail, IBKUList } from "../../models/ApprovalBKUModel";
import { AccountingRootStoreContext } from "../../stores/AccountingRootStore";
import { getIdLogin, getUserAccess } from "../../../../utils/loginuseraccess";
import Select from 'react-select';
import SyncLoader from "react-spinners/SyncLoader";
import PropagateLoader from "react-spinners/PropagateLoader";


const BkuAccounting = () => {
    const modulname = 'accounting'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'BKU Accounting';

    const [dataBKU, setDataBKU] = useState<IBKUList[]>([]);
    const [modalData, setModalData] = useState<BKUDetailAndIsDownload>();
    const [dataAkun, setDataAkun] = useState<IAkunList[]>([]);

    const [disableButton, setDisableButton] = useState(false);
    const [show, setShow] = useState(false);
    const [stateIDFnBKU, setIDFnBKU] = useState(0);
    const [stateNomor, setNomor] = useState("");
    const [stateKeterangan, setKeterangan] = useState("");
    const [stateKetRekening, setKetRekening] = useState("");

    const accountingRootStore = useContext(AccountingRootStoreContext);
    const { getDataBKU, getDataBKUDetail, getAkunList, updateAkun, approvalBKU } = accountingRootStore.bkuAccountingStore;

    const handleClose = () => {
        setShow(false);
    }

    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: Number = getIdLogin();

    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulname, formName);

    useEffect(() => {

        window.addEventListener('keypress', handleKeyPress);

        // refresh data setelah transaksi 
        loadData();

        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 3000);
        return () => clearTimeout(timer);

    }, []);

    const handleKeyPress = (event: { keyCode: any; }) => {
        console.log('A key was pressed: ', event.keyCode);
    };


    // Load data list BKU dan Akun
    const [loadingDataList, setLoadingDataList] = useState(true);
    function loadData() {

        setLoadingDataList(true);

        const BKUList = getDataBKU(id_ms_login).then(function (response) {
            setDataBKU(response.result);
            setLoadingDataList(false);
        })

        const AkunList = getAkunList().then(function (response) {
            setDataAkun(response.result);

        })
    }


    // Show modal BKU detail
    const [loadingDataModal, setLoadingDataModal] = useState(true);
    const [undefinedData, setUndefinedData] = useState(false);
    function handleShow(id_fn_bku: number, nomor: string, keterangan: string, ketRekening: string) {

        let param = {
            id_fn_bku: id_fn_bku,
            nomor: nomor
        }

        setUndefinedData(false);
        setLoadingDataModal(true);

        const detailBKU = getDataBKUDetail(param).then(function (response) {
            if (response.result.bkuDetail.length != 0) {
                setModalData(response.result);
                setLoadingDataModal(false);
            } else {
                setUndefinedData(true);
                setModalData(undefined);
                setLoadingDataModal(false);
            }
        });

        setShow(true);
        setKeterangan(keterangan);
        setKetRekening(ketRekening);
        setIDFnBKU(id_fn_bku);
        setNomor(nomor);

    }

    // Approve BKU
    function handleApprove(nomor: string, IDLogin: Number) {

        let param = {
            Nomor: nomor,
            ID_Ms_Login: IDLogin
        }

        const approveBKU = approvalBKU(param).then(function (response) {
            if (response?.statusCode === 200) {
                swal("Berhasil approve!", "Nomor : " + nomor, "success");
                setShow(false);
                loadData();
            } else {
                swal("Gagal approve!", "", "error");
                setShow(false);
            }
        });
    }

    // Download dokumen SPD
    function handleDownload(id_fn_bku: number, filename: any) {

        const token = window.localStorage.getItem('token');
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = `http://192.168.1.121:9010/api/BKU/downloadbkuapprv/${id_fn_bku}`;

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
    }


    // Update Akun
    const [loading, setLoading] = useState(false);
    const selectedOptions: any[] = [];

    function handleChange(selectedOptions: any, jenis: string, idTransAkun: number, idTransSPD: number, id_fn_bku: number, nomor: string) {

        // handle ketika value null
        const selectedValue = selectedOptions === null ? '' : selectedOptions.value

        let param = {
            KodeAkun: selectedValue,
            Jenis: jenis,
            IDTransAkun: idTransAkun,
            IDTransSPD: idTransSPD,
            ID_Fn_BKU: id_fn_bku,
            Nomor: nomor
        }

        setLoading(true);

        if (selectedOptions !== null) {
            const updAkun = updateAkun(param).then(function (response) {

                if (response?.statusCode === 200) {

                    swal("Berhasil ubah akun!", "Akun diubah menjadi : " + selectedOptions.label, "success");
                    setLoading(false);
                    handleShow(stateIDFnBKU, stateNomor, stateKeterangan, stateKetRekening);
                }
            })
        } else {
            setLoading(false)
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
                                    {/* <div className="col-md-2 ml-md-auto">
                                        <Link className="btn btn-primary btn-block" to="/addparkir" >Add</Link>
                                    </div> */}

                                </div>

                                <div className="ibox-content">
                                    <div className="table-responsive">

                                        {
                                            loadingDataList == true ?

                                                <div className="text-center">
                                                    <div style={{ padding: "100px" }}>
                                                        <PropagateLoader color={"#1ab394"} loading={loadingDataList} />
                                                    </div>

                                                </div>

                                                :

                                                <div>
                                                    <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                                        className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />


                                                    <br /><br /><br />
                                                    <table className="table table-striped table-bordered table-hover css-serial">
                                                        <thead>
                                                            <tr>
                                                                <th className="bg-primary">#</th>
                                                                <th className="text-right bg-primary">Action</th>
                                                                <th className="bg-primary">PT</th>
                                                                <th className="bg-primary">Nomor</th>
                                                                <th className="bg-primary">Tanggal</th>
                                                                <th className="bg-primary">Nilai</th>
                                                                <th className="bg-primary">Supplier</th>
                                                                <th className="bg-primary">Cara</th>
                                                                <th className="bg-primary">Keterangan</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody id="myTable">
                                                            {dataBKU.map(data => (
                                                                <tr className="gradeX">
                                                                    <td></td>
                                                                    <td className="text-right">
                                                                        <div className="btn-group">
                                                                            <Button variant="success"
                                                                                onClick={() => handleShow(data.id, data.nomor, data.keterangan, data.ketRekening)}
                                                                            >
                                                                                <i className="fa fa-info" aria-hidden="true"></i>
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                    <td>{data.pt}</td>
                                                                    <td>{data.nomor}</td>
                                                                    <td>{data.tanggalStr}</td>
                                                                    <td className="text-right">{formatPrice(data.nilai)}</td>
                                                                    <td>{data.supplier}</td>
                                                                    <td>{data.cara}</td>
                                                                    <td>{data.keterangan}</td>
                                                                </tr>
                                                            ))}

                                                        </tbody>

                                                    </table>
                                                </div>
                                        }

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal show={show} size="xl" fullscreen="xl-down" onHide={handleClose} keyboard={false} scrollable={true}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title> Detail BKU </Modal.Title>
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
                                <Row md={6}>
                                    {
                                        modalData?.isDownload == "1" ?
                                            <Col md={2}>
                                                <Button onClick={() => handleDownload(stateIDFnBKU, stateNomor)} type="button" variant="success">
                                                    <i className="fa fa-cloud-download" aria-hidden="true"></i> Download
                                                </Button>
                                            </Col>

                                            : ''
                                    }

                                    <br />
                                    <br />
                                    <br />

                                    {
                                        user_access[0][0].aksesupdate == "1" ?
                                            <Col md={2}>
                                                <Button type="button" variant="primary" onClick={() => handleApprove(modalData?.bkuDetail[0].nomor!, id_ms_login)}>Approve</Button>
                                            </Col> : ''
                                    }

                                </Row>

                            </Container>

                            <br />
                            <br />


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
                                            <th className="bg-primary">Kode Akun</th>
                                            <th className="bg-primary">Nama Akun</th>
                                            <th className="bg-primary">Harga</th>
                                            <th className="bg-primary">Detail</th>
                                            <th className="bg-primary">Edit Kode Akun</th>
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
                                                <td>
                                                    {
                                                        bkudetail.sumber == 'lain-lain' ||
                                                            bkudetail.sumber.toUpperCase() == 'SPD' ||
                                                            bkudetail.sumber.toUpperCase() == 'BTU' ?
                                                            <Select
                                                                className="basic-single react-select-width"
                                                                classNamePrefix="select"
                                                                tabSelectsValue={true}
                                                                isDisabled={false}
                                                                isClearable={true}
                                                                isSearchable={true}
                                                                options={dataAkun}
                                                                isLoading={loading}
                                                                maxMenuHeight={200}
                                                                value={selectedOptions}
                                                                onChange={(selectedOptionVal) => handleChange(
                                                                    selectedOptionVal,
                                                                    bkudetail.jenis,
                                                                    bkudetail.idTransAkun,
                                                                    bkudetail.idTransSPD,
                                                                    stateIDFnBKU,
                                                                    stateNomor)}
                                                            />
                                                            : ''
                                                    }
                                                </td>
                                            </tr>
                                        ))}


                                    </tbody>
                                </table>

                            </div>


                            <br />
                            <br />

                            <Container>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <p style={{ fontWeight: 400, padding: "3px", fontSize: "15px" }} className="badge-primary rounded">
                                            <b>REKENING : {stateKetRekening.toUpperCase()}</b>
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

                        </Modal.Body>
                }

                <Modal.Footer>

                </Modal.Footer>
            </Modal>


        </>
    );
};

export default {
    routeProps: {
        path: '/accounting/transaksi/bkuaccounting',
        exact: true,
        component: BkuAccounting
    },
    name: 'BkuAccounting',
};