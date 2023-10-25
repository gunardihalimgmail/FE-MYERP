import { useContext, useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";

import { Modal, Container, Row, Col } from 'react-bootstrap'

import { IApprovalOPDetailCompare } from "../../../models/ApprovalOPModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";
import { ProcurementRootStoreContext } from "../../../stores/ProcurementRootStore";

import { formatPrice } from '../../../../../component/format/formatPrice';

const ResponsiveModal = (props: any) => {
    const modulname = 'procurement';
    const formName = 'Approval OP';

    const { id } = props
    const id_ms_login: Number = getIdLogin();
    const user_access: any = getUserAccess(modulname, formName);
     
    const procurementRootStore = useContext(ProcurementRootStoreContext);
    const [modalData, setModalData] = useState<IApprovalOPDetailCompare>();
    const { getDataOPDetailCompare } = procurementRootStore.approvalOPStore; 

    const [loadingDataModal, setLoadingDataModal] = useState(true);

    useEffect(() => {
        if (props.show)
        {
            handleModal(props.id);
            console.log('show_props responsive modal ' + props.show + ' ' + id)
        }
    }, [props.show]);


    function handleModal(id_ps_op: number)
    {
        setLoadingDataModal(true);
        let param = {
            id_ps_op: id_ps_op,
            id_ms_login: id_ms_login
        }  

        var promise = new Promise(function(resolve, reject) {
            getDataOPDetailCompare(param).then(function (response) {
                setModalData(response.result);
            })
            resolve(true);
          })

          promise.then(resolve => setTimeout(function() {
            setLoadingDataModal(false);
          }, 1000))
    }    
    
    return (
    <div>
        <Modal 
            show={props.show} 
            size="xl" 
            fullscreen="xl-down" 
            onHide={() => {props.setModal(false);}}
            keyboard={false} 
            scrollable={true}>

            <Modal.Header closeButton className="bg-primary">
                <Modal.Title> Detail OP </Modal.Title>
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
                                <Col>
                                    <div className="external-event badge-primary">
                                        <b>Nomor: {modalData?.opapprovaldetail[0].nomorOP}</b>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-secondary">
                                        <b>Sub Total : {formatPrice(modalData?.opapprovaldetail[0].totalOP!)} </b>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <div className="external-event badge-primary">
                                        <b>SPP: {modalData?.opapprovaldetail[0].nomorSPP}</b>
                                    </div>
                                </Col>
                                
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-secondary">
                                        <b>PPN : {formatPrice(modalData?.opapprovaldetail[0].ppn!)} </b>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                <div className="external-event badge-primary">
                                        <b>Supplier :  {modalData?.opapprovaldetail[0].supplier}</b>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-warning">
                                        <b>Grand Total : {formatPrice(modalData?.opapprovaldetail[0].grandTotalOP!)} </b>
                                    </div>
                                </Col>
                            </Row>
                        </Container>

                        <div className="container">
                            <table className="table table-striped table-bordered table-hover css-serial" >
                                <thead>
                                    <tr>
                                        <th className="bg-primary">#</th>
                                        <th className="bg-primary">Nama Barang</th>
                                        <th className="bg-primary">Satuan</th>
                                        <th className="bg-primary">Jumlah</th>
                                        <th className="bg-primary">Mata Uang</th>
                                        <th className="bg-primary">Harga Satuan</th>
                                        <th className="bg-primary">Harga Total</th>
                                        <th className="bg-primary">Spesifikasi</th>
                                        <th className="bg-primary">Alasan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData?.opapprovaldetail.map(opdetail => (
                                        <tr className="gradeX" style={{ color: opdetail.alasan !== '' ? "red" : '' }}>
                                            <td></td>
                                            <td>{opdetail.namaBarang}</td>
                                            <td>{opdetail.satuan}</td>
                                            <td>{opdetail.jumlah}</td>
                                            <td className="text-right">{opdetail.mataUang}</td>
                                            <td>{formatPrice(opdetail.hargaSatuan)}</td>
                                            <td>{formatPrice(opdetail.totalHarga)}</td>
                                            <td>{opdetail.spesifikasi}</td>
                                            <td>{opdetail.alasan}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <table className="table table-striped table-bordered table-hover css-serial" >
                                <thead>
                                    <tr>
                                        <th className="bg-primary">#</th>
                                        <th className="bg-primary">Nama Barang</th>
                                        <th className="bg-primary">Compare 1</th>
                                        <th className="bg-primary">Compare 2</th>
                                        <th className="bg-primary">Compare 3</th>
                                        <th className="bg-primary">Compare 4</th>
                                        <th className="bg-primary">Compare 5</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData?.opcompareharga.map(opcompare => (
                                        <tr className="gradeX">
                                            <td></td>
                                            <td>{opcompare.namaBarang}</td>
                                            <td>{opcompare.compare1}</td>
                                            <td>{opcompare.compare2}</td>
                                            <td>{opcompare.compare3}</td>
                                            <td>{opcompare.compare4}</td>
                                            <td>{opcompare.compare5}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Container>
                            <Row>
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-secondary">
                                        <b>Negosiator : {modalData?.opapprovaldetail[0].negosiator}</b>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-secondary">
                                        <b>Incoterm  :  {modalData?.opapprovaldetail[0].incoterm}</b>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-secondary">
                                        <b>Status Barang : {modalData?.opapprovaldetail[0].statusBarang}</b>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-secondary">
                                        <b>Jadwal Kirim  :  {modalData?.opapprovaldetail[0].jadwalKirim}</b>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={6}>
                                    <div className="external-event badge-secondary">
                                        <b>Pembayaran : {modalData?.opapprovaldetail[0].pembayaran}</b>
                                    </div>
                                </Col>
                            </Row>

                        </Container>

                        <Container>
                            <Row>
                                <Col>
                                    <div>
                                        <b>CATATAN :</b>
                                        <p>
                                            {modalData?.opapprovaldetail[0].catatan.toUpperCase()}
                                        </p>
                                    </div>
                                    <div>
                                        <b>TIMELINE :</b>
                                        <pre>{modalData?.opapprovaldetail[0].timeline}</pre>
                                    </div>
                                </Col>
                            </Row>

                        </Container>

                        <div className="container mt-1">
                            <div>
                                <b>HISTORY PERUBAHAN SPESIFIKASI :</b>
                            </div>
                            <table className="table table-striped table-bordered table-hover css-serial" >
                                <thead>
                                    <tr>
                                        <th className="bg-primary">#</th>
                                        <th className="bg-primary">Spek Barang Awal</th>
                                        <th className="bg-primary">Spek Barang Divisi</th>
                                        <th className="bg-primary">Spek Barang Negosiator</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData?.ophistoryspec.map(opdetail => (
                                        <tr className="gradeX">
                                            <td></td>
                                            <td>{opdetail.nama_Spek_Lama}</td>
                                            <td>{opdetail.nama_Spek_Div}</td>
                                            <td>{opdetail.nama_Spek_Nego}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </Modal.Body>
            }

            <Modal.Footer>
            </Modal.Footer>

        </Modal>
    </div>
    );
};

export default ResponsiveModal;