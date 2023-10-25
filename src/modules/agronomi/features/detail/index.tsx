import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button } from 'react-bootstrap';
import { getGroupName, getIdLogin, getUserAccess } from "../../../../utils/loginuseraccess";
import { Field, Form } from "react-final-form";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AgronomiRootStoreContext } from "../../stores/AgronomiRootStore";
import { IPasAttachmentDesc, IPasDetail, IPASDetailResult, IPasHeader, IPasList, IPasRealisasi, plwOptions, problemOptions } from "../../models/PasListModel";
import Select from 'react-select';
import axios from "axios";


const DetailProblemKebun = () => {
    const modulname = 'agronomi'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'List Periode Lalu';

    const id_ms_login: Number = getIdLogin();
    const groupName: String = getGroupName();

    const [count, setCount] = React.useState(0);

    const [disable, setDisable] = useState(true)
    const [flag, setFlag] = useState("");
    const [commanetAnalisa, setCommanetAnalisa] = useState("");
    const [commanetSolusi, setCommanetSolusi] = useState("");
    const [dataDetailPasByID, setDataDetailPasByID] = useState<IPasDetail>();

    const [showModalComment, setShowModalComment] = useState(false);
    const [showModalAttach, setShowModalAttach] = useState(false);

    const handleCloseModalComment = () => {
        setShowModalComment(false);

    }

    const handleCloseModalAttach = () => setShowModalAttach(false);

    const agronomiRootStore = useContext(AgronomiRootStoreContext);

    const [dataPasDetail, setDataDetail] = useState<IPASDetailResult>();
    const [dataPasHeader, setDataHeader] = useState<IPasHeader>();
    const [dataPasRealisasi, setDataRealisasi] = useState<IPasRealisasi[]>();
    const [dataAttachDesc, setDataAttachDesc] = useState<IPasAttachmentDesc[]>();

    const { getDetailPAS, getHeaderPAS, getRealisasiPAS, updateComment, getDescAttach, deleteFile, uploadFile } = agronomiRootStore.pasStore;


    var id = new URLSearchParams(useLocation().search);

    const id_ag_pas_link = id.get("id_ag_pas");

    const [file, setFile] = useState("");

    const saveFile = (event: any) => {
        setFile(event.target.files[0])
    }


    useEffect(() => {

        // refresh data setelah transaksi 
        loadData();

        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 1000);
        return () => {
            clearTimeout(timer);
        }

    }, []);


    function handleChangeOpsiProblem(selectedOptions: any, datadetail: any) {

        // handle ketika option di select
        const selectedValue = selectedOptions === null ? '' : selectedOptions.value
        datadetail.isproblem = selectedValue
        // console.log(datadetail)
    }


    function addComment(strComment: string, flag: string, datadetail: any) {

        if (flag.includes('ANALISA') || flag.includes('PROBLEM') || flag.includes('PENDAPAT')) {
            setCommanetAnalisa(strComment)
            // datadetail.analisatext = strComment
        } else {
            setCommanetSolusi(strComment)
            // datadetail.solusitext = strComment
        }

    }



    function handleFinalFormSubmitUpload() {


        const formData = new FormData();
        formData.append("id_ag_pas", String(id_ag_pas_link));
        formData.append("file", file);

        console.log(formData)

        const uploadFiles = uploadFile(formData).then(function (response) {
            if (response?.statusCode === 200) {
                swal("Berhasil upload dokumen!", "", "success");
                loadData();
            } else {
                swal("Gagal upload dokumen!", "", "error");
            }
        });

    };


    // Load data detail PAS
    function loadData() {
        const PasDetail = getDetailPAS(id.get("id_ag_pas"), id_ms_login).then(function (response) {
            if (response.statusCode === 200) {
                setDataDetail(response.result);
            }
        })

        const PasHeader = getHeaderPAS(id.get("id_ag_pas")).then(function (response) {
            if (response.statusCode === 200) {
                setDataHeader(response.result);
            }
        })

        const PasRealisasi = getRealisasiPAS(id.get("id_ag_pas")).then(function (response) {
            if (response.statusCode === 200) {
                setDataRealisasi(response.result);
            }
        })

        const AttachDescList = getDescAttach(id.get("id_ag_pas")).then(function (response) {
            if (response.statusCode === 200) {
                setDataAttachDesc(response.result);
            }
        })


    }

    function handleShowComment(flag: string, datadetail: any) {

        setShowModalComment(true);

        setFlag(flag);
        setDataDetailPasByID(datadetail);

        console.log(datadetail)
        console.log(flag)
    }


    function handleShowAttach() {
        setShowModalAttach(true);

    }


    // Update Comment
    const handleFinalFormSubmitComment = () => {

        let param = {
            id: Number(id_ag_pas_link),
            id_ms_login: id_ms_login,
            analisaHeader: flag.includes('ANALISA') || flag.includes('PROBLEM') || flag.includes('PENDAPAT') ? dataDetailPasByID?.analisaheader : dataDetailPasByID?.solusiheader,
            isProblem: flag !== 'PENDAPAT' ? dataDetailPasByID?.isproblem === 'True' ? true : false : null,
            analisaText: flag.includes('ANALISA') || flag.includes('PROBLEM') || flag.includes('PENDAPAT') ? commanetAnalisa : commanetSolusi
        };

        console.log(param)

        if ((dataDetailPasByID?.isproblem == '' || dataDetailPasByID?.isproblem == null) && (flag.includes('ANALISA') || flag.includes('PROBLEM'))) {
            swal("Pilih Opsi Problem dahulu", "", "warning");
        } else if (flag.includes('SOLUSI') && dataDetailPasByID?.analisatext == null) {
            swal("Berikan analisa dahulu", "", "warning");
        } else {
            const updtComment = updateComment(param).then(function (response) {
                if (response?.statusCode === 200 && response?.result === 200) {
                    swal("Berhasil menyimpan data", "", "success");
                    loadData();
                    setDisable(true);
                } else if (response?.statusCode === 200 && response?.result === "false") {
                    swal("Gagal Menyimpan Data!", "", "error");
                }
            });
        }

    }


    function handleDownload(id_ag_pas: Number, id_ag_pas_scan: Number, deskripsi: string) {

        const token = window.localStorage.getItem('token');
        let anchor = document.createElement("a");
        document.body.appendChild(anchor);
        let file = `http://192.168.1.121:9008/api/PAS/downloadpasscan/${id_ag_pas}/${id_ag_pas_scan}/${deskripsi}`; //https://192.168.1.121:9009/

        let headers = new Headers();
        headers.append('Authorization', `Bearer ${token}`);

        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                let objectUrl = window.URL.createObjectURL(blobby);

                anchor.href = objectUrl;
                anchor.download = deskripsi;
                anchor.click();

                window.URL.revokeObjectURL(objectUrl);
            });

    }


    function handleDelete(id_ag_pas: Number, id_ag_pas_scan: Number) {

        let param = {
            ID_Ag_Pas: id_ag_pas,
            ID_Ag_Pas_Scan: id_ag_pas_scan
        };

        console.log(param)

        const dltComment = deleteFile(param).then(function (response) {
            if (response?.statusCode === 200 && response?.result === 200) {
                swal("Berhasil menghapus dokumen", "", "success");
                loadData();
            } else {
                swal("Gagal menghapus dokumen!", "", "error");
            }
        });

    }


    function setVisible(params: string, data: any) {
        if (params === 'ANALISA' && data !== null && data !== '') {
            return ""
        } else if (params === 'SOLUSI' && data !== null && data !== '') {
            return ""
        } else {
            return "none"
        }
    }

    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Detail Problem Kebun</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="">
                                    <h5></h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h2><strong>REALISASI MINGGUAN</strong> </h2>
                                </div>

                                <div className="text-center">
                                    <h2><strong>{dataPasHeader?.pt}</strong> </h2>
                                </div>

                                <div className="text-center">
                                    <h2><strong>PERIODE: {dataPasHeader?.periode} {dataPasHeader?.tahun}, MINGGU KE : {dataPasHeader?.mingguke} {dataPasHeader?.datedesc}</strong> </h2>
                                </div>

                                <br />
                                <br />


                                <div className="ibox-content">
                                    <div className="table-responsive">
                                        <div>
                                            <div style={{ backgroundColor: "#00897b", color: "white", padding: "15px" }} className="text-right"> <h4>CREATED: {dataPasHeader?.createdtime} | LAST MODIFIED: {dataPasHeader?.lastmodifiedtime}</h4> </div>

                                            <table id="mytableSort" className="table filterclass">
                                                <thead>
                                                    <tr>
                                                        <th className="bg-primary text-right"></th>
                                                        <th style={{ width: "15%" }} className="bg-primary text-right">JANJANG</th>
                                                        <th style={{ width: "7%" }} className="bg-primary text-right">BJR</th>
                                                        <th style={{ width: "7%" }} className="bg-primary text-right">IPB</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">
                                                    {dataPasRealisasi?.map(data => (
                                                        <tr>
                                                            <td className="text-right"><h4>{data.minggu}</h4></td>
                                                            <td className="text-right"><h4>{data.janjang}</h4> </td>
                                                            <td className="text-right"><h4>{data.bjr}</h4> </td>
                                                            <td className="text-right"><h4>{data.ipb}</h4> </td>
                                                        </tr>
                                                    ))}


                                                </tbody>

                                            </table>
                                        </div>
                                    </div>

                                    <br />
                                    <br />
                                    <br />

                                    <div className="row">

                                        {dataPasDetail?.pasDetail.map(data => (

                                            <div className="row col-md-12">
                                                <div style={{ display: setVisible("ANALISA", data.analisaheader) }} className="col-md-5">
                                                    <div style={{ backgroundColor: "#5ac1ac" }} className="col-md-12">
                                                        <div className="ibox">

                                                            <div className="ibox-content">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <h2>
                                                                            <strong>{data.analisaheader}</strong>
                                                                        </h2>
                                                                    </div>

                                                                    <div className="col-md-12">
                                                                        <h3 style={{ color: "#00897b" }}>
                                                                            {data.analisadate}
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                                {data.isproblem != null ?
                                                                    <h3>
                                                                        <strong>{data.isproblemdesc}</strong>
                                                                    </h3> : ''
                                                                }

                                                            </div>


                                                            <div className="ibox-content">

                                                                <br />

                                                                <textarea autoComplete="off" readOnly
                                                                    className="form-control" rows={7} value={data.analisatext} />

                                                                <br />

                                                                <div className="row justify-content-end">
                                                                    {data.analisaheader.includes(groupName.toUpperCase().split(" - ")[0]) && (groupName.toUpperCase().includes("SPV") || groupName.toUpperCase().includes("MANAGER")) ? // dataPasDetail.infoKaryawan.jabatan !== 'MANAGER' // dataPasDetail.infoKaryawan.divisi

                                                                        <div className="col-md-12">
                                                                            <Button onClick={() => handleShowComment('ANALISA', data)} className="btn btn-secondary btn-block" >EDIT &nbsp; <i className="fa fa-pencil" aria-hidden="true"></i></Button>
                                                                        </div>

                                                                        :

                                                                        ''

                                                                    }


                                                                    {groupName.toUpperCase().split(" - ")[0] == 'AGRONOMI' && data.analisaheader.includes('GM') ? // dataPasDetail.infoKaryawan.divisi

                                                                        <div className="col-md-12">
                                                                            <Button onClick={() => handleShowComment('PENDAPAT', data)} className="btn btn-secondary btn-block" >EDIT &nbsp; <i className="fa fa-pencil" aria-hidden="true"></i></Button>
                                                                        </div>

                                                                        :


                                                                        ''}


                                                                    {groupName.toUpperCase().split(" - ")[0] == 'AGRONOMI' && data.analisaheader.includes('MINGGU') ? // dataPasDetail.infoKaryawan.divisi

                                                                        <div className="col-md-12">
                                                                            <Button onClick={() => handleShowComment('PROBLEM', data)} className="btn btn-secondary btn-block" >EDIT &nbsp; <i className="fa fa-pencil" aria-hidden="true"></i></Button>
                                                                        </div>

                                                                        :


                                                                        ''}


                                                                    <br />
                                                                    <br />


                                                                    {data.analisaheader.includes('GM') ?

                                                                        <div className="col-md-12 count-info-edited">
                                                                            <span style={{ fontSize: "13px", paddingBottom: "5px", paddingTop: "5px" }} className="label label-warning"> {dataAttachDesc?.length! > 0 ? dataAttachDesc?.length! - 1 : dataAttachDesc?.length!} </span>
                                                                            <Button onClick={() => handleShowAttach()} className="btn btn-secondary btn-block" >ATTACHMENT &nbsp; <i className="fa fa-paperclip" aria-hidden="true"></i></Button>
                                                                        </div>

                                                                        :


                                                                        ''}

                                                                </div>

                                                            </div>


                                                        </div>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>

                                                <div className="col-md-2">
                                                    <div className="widget white-bg p-lg text-center">
                                                        <div className="m-b-md">
                                                            <i className="fa fa-user-circle fa-4x"></i>
                                                            <h1 className="m-xs bg">{data.divisi}</h1>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ display: setVisible("SOLUSI", data.solusiheader) }} className="col-md-5">
                                                    <div style={{ backgroundColor: "#5ac1ac" }} className="col-md-12">
                                                        <div className="ibox">
                                                            <div className="ibox-content">

                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <h2>
                                                                            <strong>{data.solusiheader}</strong>
                                                                        </h2>
                                                                    </div>

                                                                    <div className="col-md-12">
                                                                        <h3 style={{ color: "#00897b" }}>
                                                                            {data.solusidate}
                                                                        </h3>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="ibox-content">

                                                                <br />

                                                                <textarea autoComplete="off" readOnly
                                                                    className="form-control" rows={7} value={data.solusitext} />

                                                                <br />

                                                                <div className="row justify-content-end">
                                                                    {data.analisaheader.includes(groupName.toUpperCase().split(" - ")[0]) && // dataPasDetail.infoKaryawan.divisi
                                                                        (groupName.toUpperCase().includes("MANAGER") || // dataPasDetail.infoKaryawan.jabatan == 'MANAGER'
                                                                            groupName.toUpperCase().includes("SPV")) ? // dataPasDetail.infoKaryawan.jabatan == 'SUPERVISOR'

                                                                        <div className="col-md-12">
                                                                            <Button onClick={() => handleShowComment('SOLUSI', data)} className="btn btn-secondary btn-block" >EDIT &nbsp; <i className="fa fa-pencil" aria-hidden="true"></i></Button>
                                                                        </div>

                                                                        :


                                                                        ''}


                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div className="clearfix"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <br />

                                <Link className="btn btn-secondary" to="/agronomi/list/listpasperiodelalu" > <i className="fa fa-lg fa-long-arrow-left" aria-hidden="true"></i> &nbsp; <span style={{ fontSize: "15px" }} >KEMBALI</span> </Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showModalComment}
                onHide={handleCloseModalComment}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton className="bg-success">
                    <Modal.Title id="contained-modal-title-vcenter">
                        {flag.includes('ANALISA') || flag.includes('PROBLEM') || flag.includes('PENDAPAT') ? dataDetailPasByID?.analisaheader : dataDetailPasByID?.solusiheader}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="form-group">

                        {flag == 'ANALISA' || flag == 'PROBLEM' ?

                            <div>
                                <label>Opsi Problem</label>
                                <Select
                                    name={"opsiproblem"}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    tabSelectsValue={true}
                                    isDisabled={false}
                                    isSearchable={false}
                                    options={dataDetailPasByID?.analisaheader.includes('MINGGU') ? plwOptions : problemOptions}
                                    maxMenuHeight={200}
                                    defaultValue={problemOptions.find(item => item.value === dataDetailPasByID?.isproblem)}
                                    // isLoading={loading}
                                    // menuPortalTarget={document.body}
                                    // value={"data.flowType"}
                                    onChange={(selectedOptionVal) => handleChangeOpsiProblem(selectedOptionVal, dataDetailPasByID)}
                                />
                                <br /><br />
                            </div>

                            : ''
                        }


                        <label>Deskripsi</label>
                        <textarea id="message" maxLength={300}
                            onClick={() => setDisable(false)}
                            onChange={e => setCount(e.target.value.length)}
                            onBlur={event => addComment(event.target.value, flag, dataDetailPasByID)} rows={7}
                            defaultValue={flag.includes('ANALISA') || flag.includes('PROBLEM') || flag.includes('PENDAPAT') ? dataDetailPasByID?.analisatext : dataDetailPasByID?.solusitext} placeholder="Comment.." className="form-control" name={"commentdesc"} />
                        <div id="the-count">
                            <span>{count}</span>
                            <span>/ 300</span>
                        </div>

                    </div>

                    <br /><br />

                    <button disabled={disable} onClick={handleFinalFormSubmitComment} type="submit" className="btn btn-success block full-width m-b" >SAVE &nbsp; <i className="fa fa-pencil" aria-hidden="true"></i></button>
                    <a href="#">
                        <small></small>
                    </a>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleCloseModalComment()} className="btn btn-danger" >Close</Button>
                </Modal.Footer>
            </Modal>


            <Modal
                size="lg"
                show={showModalAttach}
                onHide={handleCloseModalAttach}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton className="bg-success">
                    <Modal.Title id="contained-modal-title-vcenter">
                        Attachment
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="">


                        {/* <div className="m-t">

                            <div className="form-group row">
                                <label className="col-sm-2 col-form-label">Upload File</label>
                                <div className="col-sm-8">

                                    <input onBlur={saveFile} name="fileupload" accept="multipart/form-data" className="form-control" type="file" />

                                </div>

                                <br /><br />

                                <div className="col-sm-2">
                                    <button onClick={handleFinalFormSubmitUpload} className="btn btn-success " >UPLOAD &nbsp; <i className="fa fa-pencil" aria-hidden="true"></i></button>
                                </div>

                            </div>

                            <br /><br />

                        </div> */}

                        {groupName.toUpperCase().split(" - ")[0] == 'AGRONOMI' && // dataPasDetail?.infoKaryawan.divisi
                            (groupName.toUpperCase().includes("SPV") || // dataPasDetail?.infoKaryawan.jabatan == 'SUPERVISOR'
                                groupName.toUpperCase().includes("MANAGER")) ? // dataPasDetail.infoKaryawan.jabatan == 'MANAGER'

                            <Form
                                onSubmit={handleFinalFormSubmitUpload}
                                validate={(values: { fileupload: any; }) => {
                                    const errors: any = {};
                                    if (!values.fileupload) {
                                        errors.fileupload = "Tidak ada file.";
                                    }

                                    return errors;
                                }}
                                render={({ handleSubmit }) => (
                                    <form className="m-t" method="POST" onSubmit={handleSubmit}>

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

                                            <br /><br />

                                            <div className="col-sm-2">
                                                <button type="submit" className="btn btn-success " >UPLOAD &nbsp; <i className="fa fa-pencil" aria-hidden="true"></i></button>
                                            </div>

                                        </div>

                                        <br /><br />

                                    </form>
                                )}


                            />

                            :

                            ''

                        }



                        <label>Download File</label>

                        {dataAttachDesc?.length! <= 0 ?

                            <strong><h4>Tidak Ada Attachment.</h4></strong>

                            :

                            dataAttachDesc?.map(data => (
                                <div style={{ backgroundColor: "#edc9a2" }} className="form-group row">

                                    <div className="col-md-7">
                                        <span className="label">{data.deskripsi}</span>
                                    </div>

                                    {groupName.toUpperCase().split(" - ")[0] == 'AGRONOMI' && // dataPasDetail?.infoKaryawan.divisi
                                        (groupName.toUpperCase().includes("SPV") || // dataPasDetail?.infoKaryawan.jabatan == 'SUPERVISOR'
                                            groupName.toUpperCase().includes("MANAGER")) ? // dataPasDetail.infoKaryawan.jabatan == 'MANAGER'

                                        data.deskripsi.includes('ALL_ATTACHMENT') ?

                                            <div className="col-md-2">
                                            </div>

                                            :

                                            <div className="col-md-2">
                                                <Button onClick={() => handleDelete(Number(id_ag_pas_link), data.atchid)} className="btn btn-danger" >DELETE &nbsp; <i className="fa fa-trash" aria-hidden="true"></i></Button>
                                            </div>

                                        : ''}


                                    <br /><br />

                                    <div className="col-md-3">
                                        <Button onClick={() => handleDownload(Number(id_ag_pas_link), data.atchid, data.deskripsi)} className="btn btn-primary" type="button" >DOWNLOAD <i className="fa fa-cloud" aria-hidden="true"></i></Button>
                                    </div>

                                </div>
                            ))}

                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleCloseModalAttach()} className="btn btn-danger" >Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DetailProblemKebun;