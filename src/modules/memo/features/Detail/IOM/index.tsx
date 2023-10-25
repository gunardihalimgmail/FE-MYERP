import React, { useContext, useEffect, useState } from 'react';
import { RootStoreContext } from '../../../../../stores/RootStore';
import { Form, Field } from "react-final-form";
import swal from "sweetalert";
import Alert from '../../../../../utils/alert';
import { getBagianName, getIdDivisi, getIdLogin, getUnitUsahaSelectList } from '../../../../../utils/loginuseraccess';
import Select from 'react-select';
import { IUnitUsaha } from '../../../../../models/CommonModel';
import { Button, Modal } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { useLocation } from 'react-router-dom';
import { IPasAttachmentDesc } from '../../../../agronomi/models/PasListModel';
import { decryptData } from '../../../../../utils/encrypt';
import { MemoRootStoreContext } from '../../../stores/MemoRootStore';
import { DetailDokumenResult, ListDokumenResult } from '../../../models/MemoModel';
import moment from 'moment';
import SyncLoader from "react-spinners/SyncLoader";

const DetailIOM = () => {

    const memoRootStore = useContext(MemoRootStoreContext);
    const { getDetailDokumenIOM, updateDokumenIOM, getDokumenByNomor } = memoRootStore.memoStore;


    const [nomor, setNomor] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState(0)
    const [disable, setDisable] = useState(false)

    const [showModalAttach, setShowModalAttach] = useState(false);
    const handleCloseModalAttach = () => setShowModalAttach(false);

    function handleShowAttach() {

        setShowModalAttach(true);

    }

    const [resultDetailDokumen, setResultDetailDokumen] = useState<DetailDokumenResult>();
    const [dataAttachDesc, setDataAttachDesc] = useState<IPasAttachmentDesc[]>();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const id_ms_login: Number = getIdLogin();
    const unitUsahaList: IUnitUsaha[] = getUnitUsahaSelectList();
    const bagian: String = getBagianName();
    const id_ms_divisi: Number = getIdDivisi();

    console.log("bagian:", bagian);
    console.log("id ms divisi:", id_ms_divisi);
    console.log(resultDetailDokumen?.bagian);



    const [file, setFile] = useState("");

    const id_dokumen_encrypt = localStorage.pidd;
    const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
    const id_dokumen_decrypt = decryptData(id_dokumen_encrypt, salt);


    console.log(id_dokumen_decrypt);


    const saveFile = (event: any) => {
        setFile(event.target.files[0])
    }

    function nomorStr(nomorstr: string) {
        setNomor(nomorstr)

    }


    useEffect(() => {

        loadData();

        return () => {

        };
    }, []);


    function loadData() {

        const jenisDoc = getDetailDokumenIOM(id_dokumen_decrypt).then(function (response) {
            if (response.statusCode === 200) {
                console.log(response.result);

                setResultDetailDokumen(response.result);
            }
        })
    }


    const [loadingSave, setLoadingSave] = useState(false);
    const handleFinalFormSubmit = (values: any) => {

        const { ...data } = values;

        const formData = new FormData();
        formData.append("IdDokumen", id_dokumen_decrypt);
        formData.append("IdLogin", String(id_ms_login));
        formData.append("Nomor", data.nomor);
        formData.append("Subject", data.subject);
        formData.append("StartDate", String(moment(startDate).format('YYYY-MM-DD')));
        formData.append("EndDate", String(moment(endDate).format('YYYY-MM-DD')));
        formData.append("FileData", file);


        setLoadingSave(true)
        const res = updateDokumenIOM(formData).then(function (response) {
            setMessage(response.message)
            setStatus(response.statusCode)
            if (response.statusCode == 200) {
                setLoadingSave(false)
                setDisable(true)
                swal("Berhasil update IOM!", "", "success");
            }
        })

    };


    const handleCheckNomorDokumen = () => {

        if (nomor == "" || nomor == null) {
            swal("Input nomor dahulu!", "", "warning");

        } else {
            const nomorReplace = nomor.replaceAll("/", "%2F");

            const res = getDokumenByNomor(nomorReplace).then(function (response) {
                if (response.statusCode == 200) {
                    if (response.result != null) {
                        swal("Nomor Sudah Terpakai", "Untuk dokumen : " + response.result.subject, "info");
                    } else {
                        swal("Nomor tidak ditemukan!", "Anda dapat menggunakannya sebagai nomor baru", "info");
                    }

                }
            })
        }
    };


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Detail Dokumen IOM</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title">
                                    <h5>Detail Dokumen IOM</h5>
                                </div>
                                <div className="ibox-content">


                                    <div className='form-group  row'>

                                        <label className="col-sm-2 col-form-label">Jenis Dokumen</label>
                                        <div className="col-sm-6">
                                            <input readOnly value={resultDetailDokumen?.jenisDokumen} type="text" className="form-control"
                                                placeholder='ex : Prosedur Pembelian HP Oleh Mandor Transport' />
                                        </div>

                                    </div>

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


                                    <br />
                                    <br />

                                    {resultDetailDokumen?.statusDokumen == "Active" ?

                                        bagian === resultDetailDokumen.bagian && id_ms_divisi === resultDetailDokumen.idDivisi ?

                                            <div className="form-group  row">
                                                <div className="col-sm-3">
                                                    <Button disabled={disable} onClick={() => handleShowAttach()} className="btn btn-block btn-primary" type="submit">Revisi Dokumen</Button>
                                                </div>
                                            </div>

                                            : ''

                                        : ''

                                    }



                                    <br />
                                    <br />
                                    <div className="hr-line-dashed"></div>
                                    <div className="form-group  row">
                                        <div className="embed-responsive embed-responsive-16by9">

                                            <iframe className="embed-responsive-item" src={`data:application/pdf;base64,${resultDetailDokumen?.fileData}#view=fitH`} height="100%" width="100%" allowFullScreen></iframe>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal
                size="lg"
                show={showModalAttach}
                onHide={handleCloseModalAttach}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton className="bg-success">
                    <Modal.Title id="contained-modal-title-vcenter">
                        Revisi Dokumen IOM
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="">

                        {
                            status != 0 ?
                                <> <Alert message={message} status={status} /> </> : <> </>
                        }

                        <Form
                            onSubmit={handleFinalFormSubmit}
                            validate={(values: { fileupload: any; }) => {
                                const errors: any = {};
                                if (!values.fileupload) {
                                    errors.fileupload = "Tidak ada file.";
                                }

                                return errors;
                            }}
                            initialValues={resultDetailDokumen}
                            render={({ handleSubmit }) => (
                                <form className="m-t" method="POST" onSubmit={handleSubmit}>

                                    <div className="form-group  row">
                                        <Field name="subject">
                                            {({ input, meta }) => {
                                                return (
                                                    <React.Fragment>
                                                        <label className="col-sm-2 col-form-label">Subject</label>
                                                        <div className="col-sm-6">
                                                            <input {...input} type="text" className="form-control"
                                                                placeholder='ex : Prosedur Pembelian HP Oleh Mandor Transport' />
                                                        </div>
                                                        <div className="text-danger">
                                                            {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            }}
                                        </Field>
                                    </div>
                                    <div className="form-group  row">
                                        <Field name="nomor">
                                            {({ input, meta }) => {
                                                return (
                                                    <React.Fragment>
                                                        <label className="col-sm-2 col-form-label">Nomor</label>
                                                        <div className="col-sm-6">
                                                            <input {...input} onBlur={event => nomorStr(event.target.value)} type="text" className="form-control" placeholder='Masukkan Nomor' />
                                                            <div className="text-danger">
                                                                {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                            </div>
                                                        </div>

                                                    </React.Fragment>
                                                );
                                            }}
                                        </Field>
                                        <Button variant="success" onClick={() => handleCheckNomorDokumen()} >Check Nomor</Button>
                                    </div>


                                    <div className="form-group  row">
                                        <label className="col-sm-2 col-form-label">Start Date</label>
                                        <div className="col-sm-6">
                                            <DatePicker
                                                className="form-control"
                                                selected={startDate}
                                                onChange={(date: Date) => setStartDate(date)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group  row">
                                        <label className="col-sm-2 col-form-label">End Date</label>
                                        <div className="col-sm-6">
                                            <DatePicker
                                                className="form-control"
                                                selected={endDate}
                                                onChange={(date: Date) => setEndDate(date)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-2 col-form-label">Upload File</label>
                                        <div className="col-sm-8">

                                            <Field name="fileupload" onBlur={saveFile}>
                                                {({ input, meta }) => {
                                                    return (
                                                        <React.Fragment>
                                                            <Field onBlur={saveFile} name="fileupload" accept=".pdf,.jpg,.jpeg,.png" component="input" className="form-control" type="file" multiple />

                                                            <div className="text-danger">
                                                                {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                            </div>
                                                        </React.Fragment>
                                                    );
                                                }}
                                            </Field>
                                        </div>


                                    </div>

                                    <br /><br />
                                    {
                                        loadingSave === true ?

                                            // className="text-center"
                                            <div className="form-group  row">
                                                <div className='col-sm-3' style={{ padding: "50px" }}>
                                                    <SyncLoader color={"#1ab394"} loading={loadingSave} />
                                                </div>

                                            </div>

                                            :

                                            <div className="form-group  row">
                                                <div className="col-sm-3">
                                                    <button disabled={disable} className="btn btn-block btn-primary" type="submit">Save</button>
                                                </div>
                                            </div>
                                    }

                                </form>
                            )}


                        />

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleCloseModalAttach()} className="btn btn-danger" >Close</Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default DetailIOM;