import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Row, Col } from 'react-bootstrap'
import { IDetailTTIS, IOPHistory, ILPBHistory } from "../../../models/ApprovalTTISModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";
import { ProcurementRootStoreContext } from "../../../stores/ProcurementRootStore";
import SyncLoader from "react-spinners/SyncLoader";

const ResponsiveModal = (props: any) => {
    const modulname = 'procurement';
    const formName = 'Approval TTIS';

    const { id } = props
    const id_ms_login: Number = getIdLogin();
    const user_access: any = getUserAccess(modulname, formName);
    
    const procurementRootStore = useContext(ProcurementRootStoreContext);
    const [dtlTTIS, setDtlTTIS] = useState<IDetailTTIS[]>([]);
    const [hdrTTIS, setHdrTTIS] = useState<IDetailTTIS>();
    const [hstOP, setHstOP] = useState<IOPHistory[]>([]);
    const [hstLPB, setHstLPB] = useState<ILPBHistory[]>([]);   
    const { getDetailTTIS, getHstOPTTIS, getHstLPBTTIS, approveTTIS } = procurementRootStore.approvalTTISStore;
    
    const [loadingDataModal, setLoadingDataModal] = useState(true);

    useEffect(() => {
        if (props.modal)
        {
            const handleModal = (id_ps_ttis: number) =>
            {
                return new Promise<void>(function(resolve, reject) {
                    try
                    {
                        const detailTTIS = getDetailTTIS(id_ps_ttis).then(function (response) {
                            setDtlTTIS(response.result);
                            setHdrTTIS(response.result[0]);
                        })
        
                        const hstOP = getHstOPTTIS(id_ps_ttis).then(function (response) {
                            setHstOP(response.result);
                            console.log('detail op ' + hstOP);
                        })
        
                        const hstLPB = getHstLPBTTIS(id_ps_ttis).then(function (response) {
                            setHstLPB(response.result);
                            console.log('detail lpb ' + hstLPB);    
                        })
                        resolve();
                    }
                    catch
                    {
                        reject();
                    }
                })
            } 

            setLoadingDataModal(true);
            handleModal(props.id).then(() => {
                setTimeout(() => {
                    setLoadingDataModal(false);  
                }, 500);
            })
        }
    }, [props.modal]);


    function handleApprove(id_ps_ttis: number | undefined , nomor_ttis: string | undefined) {
        let param = {
            id_ps_ttis: Number(id_ps_ttis),
            id_ms_login: Number(id_ms_login) 
        }

        const ApproveTTIS = approveTTIS(param).then(function (response) {
            if (response?.statusCode === 200) {
                swal("Berhasil Approve TTIS !", "Nomor : " + nomor_ttis, "success")
                .then(() => {
                    props.setReload(true);
                    props.setModal(false);
                });
            } else {
                swal("Gagal approve!", "", "error");
            }
        });
    }

    return (
    <div>
        <Modal 
            show={props.modal} 
            size="xl" 
            fullscreen="xxl-down"
            onHide={() => {props.setModal(false);}} 
            keyboard={false} 
            scrollable={true}
            >

            <Modal.Header closeButton className="bg-primary">
                <Modal.Title> Detail TTIS </Modal.Title>
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
                        <div className="ibox">
                        <Row>                                   
                            <Col>
                                {user_access[0][0].aksesupdate == "1" ? <Button variant="primary" 
                                onClick={() => handleApprove(hdrTTIS?.id_ps_ttis, hdrTTIS?.nomor_ttis)} >Approve</Button> : ''}
                            </Col>
                        </Row>

                        <div className="ibox">
                            <p className="hr-line-dashed bg-primary" />
                            <div className="ibox-content text-center">
                                <h2><b>{hdrTTIS?.pt}</b></h2>
                                <h3>TANDA TERIMA INVOICE SUPPLIER (TTIS)</h3>
                                <h3>{hdrTTIS?.supplier}</h3>
                            </div>
                            <p className="hr-line-dashed bg-primary" /> 
                        </div>
                                                       
                        <div className="ibox">
                            <Row>
                                <Col>
                                    <div className="external-event navy-bg"> 
                                        <b>Nomor TTIS : {hdrTTIS?.nomor_ttis}</b>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="external-event navy-bg"> 
                                        <b>Tanggal TTIS :  {hdrTTIS?.tanggal_ttis}</b>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="external-event navy-bg">
                                        <b>Incoterms: {hdrTTIS?.franco}</b>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="external-event navy-bg"> 
                                        <b>Tipe OP : {hdrTTIS?.tipe_op}</b>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="external-event navy-bg"> 
                                        <b>Mata Uang :  {hdrTTIS?.mata_uang}</b>
                                    </div>
                                </Col>
                                <Col/>
                            </Row>
                            <p className="hr-line-dashed bg-primary" />
                            <table className="table table-secondary table-striped table-bordered table-hover css-serial" >
                                <thead>
                                    <tr>
                                        <th className="bg-primary">#</th>
                                        <th className="bg-primary">Nomor OP</th>
                                        <th className="bg-primary">Tanggal OP</th>
                                        <th className="bg-primary">Total OP</th>
                                        <th className="bg-primary">PPN</th>
                                        <th className="bg-primary">Tagihan</th>
                                        <th className="bg-primary">Tanggal Inv.</th>
                                        <th className="bg-primary">Status Barang</th>
                                        <th className="bg-primary">Jadwal Kirim</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dtlTTIS.map(ttisdetail => (
                                        <tr key={ttisdetail.id} className="gradeX">
                                            <td></td>
                                            <td>{ttisdetail.nomor_op}</td>
                                            <td>{ttisdetail.tanggal_op}</td>
                                            <td className="text-right">{ttisdetail.total_op}</td>
                                            <td className="text-right">{ttisdetail.ppn}</td>
                                            <td className="text-right">{ttisdetail.tagihan}</td>
                                            <td>{ttisdetail.tanggal_invoice}</td>
                                            <td>{ttisdetail.status_barang}</td>
                                            <td>{ttisdetail.waktu_antar}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>

                            <div className="ibox">
                                <p className="hr-line-dashed bg-primary" />                                
                                <h3 className="font-bold m-b-xs">Detail History Transaksi OP</h3>
                                <table className="table table-secondary table-striped table-bordered table-hover css-serial" >
                                    <thead>
                                        <tr>
                                            <th className="bg-primary">#</th>
                                            <th className="bg-primary">Nomor OP</th>
                                            <th className="bg-primary">Tanggal OP</th>
                                            <th className="bg-primary">Nomor LPB</th>
                                            <th className="bg-primary">Tanggal LPB</th>
                                            <th className="bg-primary">Total OP</th>
                                            <th className="bg-primary">Pembayaran</th>
                                            <th className="bg-primary">Nomor TTIS</th>
                                            <th className="bg-primary">Tanggal TTIS</th>
                                            <th className="bg-primary">Nomor BKU</th>
                                            <th className="bg-primary">Tanggal BKU</th>
                                            <th className="bg-primary">Nomor Voucher</th>
                                            <th className="bg-primary">Tanggal Voucher</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hstOP.map(ophistory => (
                                            <tr key={ophistory.id} className="gradeX">
                                                <td></td>
                                                <td>{ophistory.nomor_op}</td>
                                                <td>{ophistory.tanggal_op}</td>
                                                <td>{ophistory.nomor_lpb}</td>
                                                <td>{ophistory.tanggal_lpb}</td>
                                                <td className="text-right">{ophistory.total_op}</td>
                                                <td className="text-right">{ophistory.pembayaran}</td>
                                                <td>{ophistory.nomor_ttis}</td>
                                                <td>{ophistory.tanggal_ttis}</td>
                                                <td>{ophistory.nomor_bku}</td>
                                                <td>{ophistory.tanggal_bku}</td>
                                                <td>{ophistory.nomor_voucher}</td>
                                                <td>{ophistory.tanggal_voucher}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        
                            <div className="ibox">
                                <p className="hr-line-dashed bg-primary" />
                                <h3 className="font-bold m-b-xs">Detail History Transaksi LPB</h3>
                               
                                <table className="table table-secondary table-striped table-bordered table-hover css-serial" >
                                    <thead>
                                        <tr>
                                            <th className="bg-primary">#</th>
                                            <th className="bg-primary">Nomor OP</th>
                                            <th className="bg-primary">Tanggal OP</th>
                                            <th className="bg-primary">Total OP</th>
                                            <th className="bg-primary">PPN</th>
                                            <th className="bg-primary">Nomor LPB</th>
                                            <th className="bg-primary">Tanggal LPB</th>
                                            <th className="bg-primary">Total LPB</th>
                                            <th className="bg-primary">Approval LPB</th>
                                            <th className="bg-primary">Nomor TTIS</th>
                                            <th className="bg-primary">SKBI</th>
                                            <th className="bg-primary">Total SKBI</th>
                                            <th className="bg-primary">STBI</th>
                                            <th className="bg-primary">Total STBI</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {hstLPB.map(lpbhistory => (
                                            <tr key={lpbhistory.id} className="gradeX">
                                                <td></td>
                                                <td>{lpbhistory.nomor_op}</td>
                                                <td>{lpbhistory.tanggal_op}</td>
                                                <td className="text-right">{lpbhistory.total_op}</td>
                                                <td className="text-right">{lpbhistory.ppn}</td>
                                                <td>{lpbhistory.nomor_lpb}</td>
                                                <td>{lpbhistory.tanggal_lpb}</td>
                                                <td className="text-right">{lpbhistory.total_lpb}</td>
                                                <td>{lpbhistory.approval_lpb}</td>
                                                <td>{lpbhistory.nomor_ttis}</td>
                                                <td>{lpbhistory.skbi}</td>
                                                <td className="text-right">{lpbhistory.total_skbi}</td>
                                                <td>{lpbhistory.stbi}</td>
                                                <td className="text-right">{lpbhistory.total_stbi}</td>
                                            </tr>
                                        ))}
                                        <tr className="gradeX">

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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