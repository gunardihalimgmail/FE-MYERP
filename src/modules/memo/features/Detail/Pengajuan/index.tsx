import React, { useContext, useEffect, useState } from 'react';
import { RootStoreContext } from '../../../../../stores/RootStore';
import { Form, Field } from "react-final-form";
import swal from "sweetalert";
import Alert from '../../../../../utils/alert';
import { getBagianName, getIdLogin, getUnitUsahaSelectList } from '../../../../../utils/loginuseraccess';
import Select from 'react-select';
import { IUnitUsaha } from '../../../../../models/CommonModel';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { useLocation } from 'react-router-dom';
import { IPasAttachmentDesc } from '../../../../agronomi/models/PasListModel';
import { decryptData } from '../../../../../utils/encrypt';
import { MemoRootStoreContext } from '../../../stores/MemoRootStore';
import { DetailDokumenResult, divisiOptions, ListDokumenResult, SelectListOptions } from '../../../models/MemoModel';
import moment from 'moment';

const DetailPengajuan = () => {

    const memoRootStore = useContext(MemoRootStoreContext);
    const { getDetailDokumenPengajuan, rejectDokumenPengajuan } = memoRootStore.memoStore;


    const [message, setMessage] = useState("")
    const [status, setStatus] = useState(0)
    const [disable, setDisable] = useState(false)

    const [showModalAttach, setShowModalAttach] = useState(false);
    const handleCloseModalAttach = () => setShowModalAttach(false);

    const [showModalComment, setShowModalComment] = useState(false);
    const handleCloseModalComment = () => setShowModalComment(false);

    function handleShowAttach() {

        setShowModalAttach(true);

    }

    const bagian: String = getBagianName();

    const [resultDetailDokumen, setResultDetailDokumen] = useState<DetailDokumenResult>();
    const [dataAttachDesc, setDataAttachDesc] = useState<IPasAttachmentDesc[]>();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [stateDivisiSelected, setstateDivisiSelected] = useState<SelectListOptions[]>([]);

    const id_ms_login: Number = getIdLogin();
    const unitUsahaList: IUnitUsaha[] = getUnitUsahaSelectList();

    const [file, setFile] = useState("");

    const id_dokumen_encrypt = localStorage.pidd;
    const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const id_dokumen_decrypt = decryptData(id_dokumen_encrypt, salt);

    console.log(id_dokumen_decrypt)


    const saveFile = (event: any) => {
        setFile(event.target.files[0])
    }


    useEffect(() => {

        loadData();

        loadjs();

    }, []);

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


    function loadData() {

        const detailDocPengajuan = getDetailDokumenPengajuan(id_dokumen_decrypt).then(function (response) {
            if (response.statusCode === 200) {
                setResultDetailDokumen(response.result);
            }
        })
    }


    function RejectNote() {

        setShowModalComment(true);
    }

    const handleReject = (values: any) => {

        const { ...dataReject } = values;

        let requestParam = {
            IdDokumen: id_dokumen_decrypt,
            RejectNote: dataReject.commentreject,
            IdLogin: id_ms_login
        }

        // setDisable(true)

        const res = rejectDokumenPengajuan(requestParam).then(function (response) {
            setMessage(response.message)
            setStatus(response.statusCode)
            if (response.statusCode == 200) {
                setDisable(true)
                handleCloseModalComment()
                swal("Berhasil reject pengajuan!", "", "success");
            }
        })

    };


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Detail Dokumen Pengajuan</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title">
                                    <h5>Detail Dokumen Pengajuan</h5>
                                </div>

                                <div className="ibox-content">
                                    {
                                        status != 0 ?
                                            <> <Alert message={message} status={status} /> </> : <> </>
                                    }

                                    <div className='form-group  row'>
                                        <label className="col-sm-2 col-form-label">Kategori</label>
                                        <div className="col-sm-6">
                                            <input value={resultDetailDokumen?.kategoriDokumen} readOnly type="text" className="form-control"
                                                placeholder='ex : Prosedur Pembelian HP Oleh Mandor Transport' />
                                        </div>
                                    </div>

                                    <div className='form-group  row'>
                                        <label className="col-sm-2 col-form-label">Sub Kategori</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.subKategoriDokumen} type="text" className="form-control"
                                                placeholder='ex : Prosedur Pembelian HP Oleh Mandor Transport' />
                                        </div>
                                    </div>

                                    <div className="form-group  row">

                                        <label className="col-sm-2 col-form-label">Subject</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.subject} type="text" className="form-control"
                                                placeholder='ex : Prosedur Pembelian HP Oleh Mandor Transport' />
                                        </div>
                                    </div>
                                    <div className="form-group  row">
                                        <label className="col-sm-2 col-form-label">Nomor</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.nomor} type="text" className="form-control" placeholder='Masukkan Nomor' />

                                        </div>
                                    </div>
                                    <div className='form-group  row'>
                                        <label className="col-sm-2 col-form-label">Flag Dokumen</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.flagDokumen} type="text" className="form-control"
                                                placeholder='ex : Prosedur Pembelian HP Oleh Mandor Transport' />
                                        </div>
                                    </div>
                                    <div className='form-group  row'>
                                        <label className="col-sm-2 col-form-label">Status Dokumen</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.statusDokumen} type="text" className="form-control"
                                                placeholder='ex : Prosedur Pembelian HP Oleh Mandor Transport' />
                                        </div>
                                    </div>
                                    <div className="form-group  row">
                                        <label className="col-sm-2 col-form-label">Tanggal Awal Berlaku</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.tanggalAwalBerlaku.replace("T00:00:00", "")} type="text" className="form-control" placeholder='Masukkan Nomor' />
                                        </div>
                                    </div>
                                    <div className="form-group  row">
                                        <label className="col-sm-2 col-form-label">Tanggal Akhir Berlaku</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.tanggalAkhirBerlaku != null ? resultDetailDokumen?.tanggalAkhirBerlaku.replace("T00:00:00", "") : ''} type="text" className="form-control" />

                                        </div>
                                    </div>
                                    <div className='form-group  row'>
                                        <label className="col-sm-2 col-form-label">Reject Note</label>
                                        <div className="col-sm-6">
                                            <textarea readOnly value={resultDetailDokumen?.rejectNote} className="form-control" />
                                        </div>
                                    </div>

                                    <br />
                                    <br />

                                    <div className="row col-md-9">
                                        {divisiOptions.map(data =>
                                            <div className="col-lg-3">
                                                <label className="checkboxcontainer">

                                                    {resultDetailDokumen?.divisi.split("|").map(divisi =>
                                                        <input
                                                            readOnly
                                                            value={data.value}
                                                            // onChange={() => selectDoc(data)}
                                                            type="checkbox"
                                                            checked={data.value === divisi ? true : false}
                                                        />
                                                    )}

                                                    <span className="checkmark"></span>
                                                    {data.label}
                                                </label>
                                            </div>

                                        )}

                                    </div>

                                    <br />
                                    <br />

                                    {resultDetailDokumen?.statusDokumen == "Active" ?

                                        bagian !== 'EST' ?
                                            <div className="form-group  row">
                                                <div className="col-sm-3">
                                                    <button disabled={disable} onClick={() => RejectNote()} className="btn btn-block btn-danger" type="submit">Reject</button>
                                                </div>
                                            </div> : ''


                                        : ''
                                    }


                                    <br />
                                    <div className="hr-line-dashed"></div>
                                    <div className="form-group  row">
                                        <div className="embed-responsive embed-responsive-16by9">
                                            <iframe className="embed-responsive-item" src={`data:application/pdf;base64,${resultDetailDokumen?.fileData}`} allowFullScreen></iframe>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


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
                        {
                            status != 0 ?
                                <> <Alert message={message} status={status} /> </> : <> </>
                        }

                        <h3>Alasan Reject</h3>
                        <Form
                            onSubmit={handleReject}
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

    )
}

export default DetailPengajuan;