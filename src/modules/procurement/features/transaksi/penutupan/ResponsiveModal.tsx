import { useContext, useEffect, useState } from "react";

import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap'
import SyncLoader from "react-spinners/SyncLoader";
import swal from "sweetalert";

import { ProcurementRootStoreContext } from "../../../stores/ProcurementRootStore";
import { IDetailPenutupan, IPenutupanList } from "../../../models/PenutupanModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";

import { formatPrice } from '../../../../../component/format/formatPrice';

const ResponsiveModal = (props: any) => {
    const modulname = 'procurement';
    const formName = 'Approval OP';

    const { id } = props
    const id_ms_login: Number = getIdLogin();
    const user_access: any = getUserAccess(modulname, formName);
    
    const procurementRootStore = useContext(ProcurementRootStoreContext);
    const { getDataPenutupanDetail, approvalPenutupan } = procurementRootStore.penutupanStore;
    const [modalData, setModalData] = useState<IDetailPenutupan[]>([]);

    const [disableButton, setDisableButton] = useState(false);
    // load when id_props changed

    useEffect(() => {
        if (props.show)
        {
            handleModal(props.id, props.referensi);
            console.log('show_props responsive modal ' + props.show + ' ' + id)
        }
    }, [props.show]);

    // show detail
    const [loadingDataModal, setLoadingDataModal] = useState(true);
    function handleModal(id_spp_op_skbi: number, referensi: string) {
        let param = {
            ID: id_spp_op_skbi,
            Referensi: referensi
        }
        setLoadingDataModal(true);

        const detailPenutupan = getDataPenutupanDetail(param);
        detailPenutupan.then(function (response) {
            setModalData(response.result);
            setLoadingDataModal(false);
        })
    }

    function handleApprove(id_spp_op_skbi: Number | undefined, jenis: string, nomor: string) {
        let param = {
            ID: id_spp_op_skbi,
            ID_Ms_Login: id_ms_login,
            Jenis: jenis,
            FlagApproveOrReject: "Approve"
        }

        const ApprovePenutupan = approvalPenutupan(param).then(function (response) {
            if (response?.statusCode === 200) {
                props.setModal(false);
                props.setReload(true);
                swal("Berhasil Approve!", "Nomor : " + nomor, "success");
            } else {
                swal("Gagal Approve!", "", "error");
            }
        });
    }

    function handleReject(id_spp_op_skbi: Number | undefined, jenis: string, nomor: string) {

        let param = {
            ID: id_spp_op_skbi,
            ID_Ms_Login: id_ms_login,
            Jenis: jenis,
            FlagApproveOrReject: "Reject"
        }

        const RejectPenutupan = approvalPenutupan(param).then(function (response) {
            if (response?.statusCode === 200) {
                swal("Berhasil Reject!", "Nomor : " + nomor, "success");
                props.setModal(false);
                props.setReload(true);
            } else {
                swal("Gagal Reject!", "", "error");
            }

        });
    }

    return (
    <div>
        <Modal 
         show={props.show} 
         size="xl" 
         fullscreen="xl-down" 
         onHide={() => {props.setModal(false);}} 
         keyboard={false} 
         scrollable={true}
         >
            
            <Modal.Header closeButton className="bg-primary">
                <Col><Modal.Title> Detail Penutupan </Modal.Title></Col>
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
                            {user_access[0][0].aksesupdate === "1" ?
                                <div className="ibox" style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button disabled={disableButton} variant="primary" onClick={() =>
                                        handleApprove(
                                            Number(modalData[0]?.flag.split(" - ")[0]),
                                            String(modalData[0]?.flag.split(" - ")[1]),
                                            String(modalData[0]?.negosiator.split(" - ")[0])
                                        )}>Approve</Button>

                                    <Button disabled={disableButton} variant="danger"
                                        onClick={() =>
                                            handleReject(
                                                Number(modalData[0]?.flag.split(" - ")[0]),
                                                String(modalData[0]?.flag.split(" - ")[1]),
                                                String(modalData[0]?.negosiator.split(" - ")[0]) //modalData?.map(anObjectMapped => anObjectMapped.negosiator.split(" - ")[0])[0]
                                            )
                                        } >Reject</Button>
                                </div>

                                : ''
                            }
                            <div className="ibox">
                                <Row>
                                    <Col>
                                        <div className="external-event navy-bg"> 
                                            <b>Negosiator : {modalData[0]?.negosiator.toUpperCase()}</b>
                                        </div>
                                        <div className="external-event navy-bg"> 
                                            <b>Pembuat : {modalData[0]?.pembuat.toUpperCase()}</b>
                                         </div>
                                    </Col>
                                </Row>

                            <table className="table table-striped table-bordered table-hover css-serial" >
                                <thead>
                                    <tr>
                                        <th className="bg-primary">#</th>
                                        <th className="bg-primary">Kode Barang</th>
                                        <th className="bg-primary">Nama Barang</th>
                                        <th className="bg-primary">Jumlah 1</th>
                                        <th className="bg-primary">Jumlah 2</th>
                                        <th className="bg-primary">Selisih</th>
                                        <th className="bg-primary">Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modalData?.map(penutupanDetail => (
                                        <tr className="gradeX">
                                            <td></td>
                                            <td>{penutupanDetail.kodeBarang}</td>
                                            <td>{penutupanDetail.namaBarang}</td>
                                            <td>{formatPrice(penutupanDetail.jumlah1)}</td>
                                            <td>{formatPrice(penutupanDetail.jumlah2)}</td>
                                            <td>{formatPrice(penutupanDetail.selisih)}</td>
                                            <td>{penutupanDetail.remark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Row>
                                <Col>
                                    <p style={{ fontWeight: 400 }}>
                                        <b>Perihal Penutupan : </b>
                                    </p>
                                    <p>{modalData[0]?.perihalPenutupan}</p>

                                    <p style={{ fontWeight: 400 }}>
                                        <b>Alasan Penutupan :</b>
                                    </p>
                                    <p>{modalData[0]?.alasanPenutupan}</p>
                                </Col>
                            </Row>
                            </div>
                    </Modal.Body>
            }
        </Modal>
    </div>
    );
};

export default ResponsiveModal;