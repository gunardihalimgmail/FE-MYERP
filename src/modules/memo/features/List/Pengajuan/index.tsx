import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { getBagianName, getIdDivisi, getIdLogin, getIdUnitUsaha, getUnitUsahaSelectList, getUserAccess } from "../../../../../utils/loginuseraccess";
import SyncLoader from "react-spinners/SyncLoader";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Field, Form } from "react-final-form";
import React from "react";
import ButtonLoader from "../../../../../component/button/buttonloader";
import { Link, Redirect } from "react-router-dom";
import Select from 'react-select';
import Alert from "../../../../../utils/alert";
import { IJenisDokumen, ListDokumenResult, SelectListOptions, statusDokumenOptions } from "../../../models/MemoModel";
import { AgPasOptions, IPasList } from "../../../../agronomi/models/PasListModel";
import DatePicker from "react-datepicker";
import { encryptData } from "../../../../../utils/encrypt";
import { IUnitUsaha } from "../../../../../models/CommonModel";
import { MemoRootStoreContext } from "../../../stores/MemoRootStore";
import moment from 'moment';


const ListPengajuan = () => {
    const modulname = 'memo'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'List Pengajuan';

    const memoRootStore = useContext(MemoRootStoreContext);
    const { getListJenisDokumen, getListKategoriDokumen, getListSubKategoriDokumen, getListDokumenPengajuan } = memoRootStore.memoStore;

    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(0);
    const [linkToDetail, setOnLinkToDetail] = useState(false)
    const [IdDokumen, setIdDokumen] = useState(0)

    const [resultListDokumenPengajuan, setResultListDokumenPengajuan] = useState<ListDokumenResult[]>();
    const [requestKategori, setRequestKategori] = useState(0);
    const [requestSubKategori, setRequestSubKategori] = useState(0);
    const [dataJenisDokumen, setDataJenisDokumen] = useState<SelectListOptions[]>();
    const [dataKategoriDokumen, setDataKategoriDokumen] = useState<SelectListOptions[]>();
    const [dataSubKategoriList, setDataSubKategoriList] = useState<SelectListOptions[]>();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const id_ms_login: Number = getIdLogin();
    const bagian: String = getBagianName();
    const id_ms_divisi: Number = getIdDivisi();
    const id_ms_unitusaha: Number = getIdUnitUsaha();

    const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';

    const unitUsahaList: IUnitUsaha[] = getUnitUsahaSelectList();


    useEffect(() => {

        // refresh data setelah transaksi 
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

    // Load data list BKU dan Akun
    function loadData() {
        const jenisDoc = getListJenisDokumen().then(function (response) {
            if (response.statusCode === 200) {
                setDataJenisDokumen(response.result);
            }
        })

        const KategoriList = getListKategoriDokumen().then(function (response) {
            if (response.statusCode === 200) {
                setDataKategoriDokumen(response.result);
            }
        })

    }


    function handleGetSubKategoriList(selectedOptions: any) {

        const selectedValue = selectedOptions === null ? '' : selectedOptions.value

        setRequestKategori(selectedValue)

        const SubKategoriList = getListSubKategoriDokumen(Number(selectedValue)).then(function (response) {
            if (response.statusCode === 200) {
                setDataSubKategoriList(response.result);
            }
        })

    }


    function handleSubKategori(selectedOptions: any) {

        const selectedValue = selectedOptions === null ? 0 : selectedOptions.value

        setRequestSubKategori(selectedValue)

    }


    function handleLinkToDetail(idDok: number) {
        const salt = 'aa4f6da0-81fc-4d75-89a2-e744ff3e74f3';
        const idDokEncrypt = encryptData(idDok, salt);
        localStorage.setItem('pidd', idDokEncrypt);

        setIdDokumen(idDok);
        setOnLinkToDetail(true);
    }


    const handleFinalFormSubmit = (values: any) => {

        const { ...data } = values;

        if (requestKategori == 0) {
            swal("Kategori harus di isi", "", "warning");
        } else {
            let requestData = {
                idLogin: id_ms_login,
                idUnitUsaha: id_ms_unitusaha,
                bagian: bagian,
                idKategori: Number(requestKategori),
                idSubKategori: Number(requestSubKategori),
                idDivisi: id_ms_divisi,
                statusDokumen: String(data.statusdokumen.value),
                tanggalAwal: String(moment(startDate).format('YYYY-MM-DD')),
                tanggalAkhir: String(moment(endDate).format('YYYY-MM-DD')),
            };

            console.log(requestData);


            const res = getListDokumenPengajuan(requestData).then(function (response) {
                if (response.statusCode == 200) {
                    setResultListDokumenPengajuan(response.result);
                }
            })
        }

    }


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>List Pengajuan</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>List Pengajuan</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="ibox-content">

                                    <div className="text-center">
                                        <h2 >KRITERIA PENCARIAN</h2>
                                    </div>

                                    <div className="m-t">
                                        {
                                            status != 0 ?
                                                <> <Alert message={message} status={status} /> </> : <> </>
                                        }
                                        <Form
                                            onSubmit={handleFinalFormSubmit}
                                            validate={values => {
                                                const errors: any = {};

                                                // if (!values.jenisdokumen) {
                                                //     errors.jenisdokumen = "Jenis Dokumen is required";
                                                // }

                                                // if (!values.subkategori) {
                                                //     errors.subkategori = "Sub Kategori is required";
                                                // }

                                                if (!values.statusdokumen) {
                                                    errors.statusdokumen = "Status Dokumen is required";
                                                }

                                                return errors;
                                            }}

                                            render={({ handleSubmit }) => (
                                                <form className="form-group row" method="POST" onSubmit={handleSubmit}>

                                                    <div className="col-md-6">
                                                        <div className='form-group'>
                                                            <label className="col-form-label">Kategori</label>
                                                            <Select
                                                                className="basic-single react-select"
                                                                classNamePrefix="select"
                                                                tabSelectsValue={false}
                                                                isDisabled={false}
                                                                isClearable={false}
                                                                isSearchable={true}
                                                                menuPortalTarget={document.body}
                                                                maxMenuHeight={200}
                                                                options={dataKategoriDokumen}
                                                                onChange={(selectedOptionVal) => handleGetSubKategoriList(selectedOptionVal)}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className='form-group'>

                                                            <label className="col-form-label">Sub Kategori</label>
                                                            <Select
                                                                className="basic-single react-select"
                                                                classNamePrefix="select"
                                                                tabSelectsValue={false}
                                                                isDisabled={false}
                                                                isClearable={false}
                                                                isSearchable={false}
                                                                menuPortalTarget={document.body}
                                                                maxMenuHeight={200}
                                                                options={dataSubKategoriList}
                                                                onChange={(selectedOptionVal) => handleSubKategori(selectedOptionVal)}
                                                            />
                                                        </div>
                                                    </div>


                                                    {/* <div className="col-md-6">
                                                        <div className='form-group'>
                                                            <Field name="jenisdokumen">
                                                                {({ input, meta }) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <label className="col-form-label">Jenis Dokumen</label>

                                                                            {bagian === 'JKT' ?

                                                                                <Select {...input}
                                                                                    className="basic-single react-select"
                                                                                    classNamePrefix="select"
                                                                                    tabSelectsValue={false}
                                                                                    isDisabled={false}
                                                                                    isClearable={false}
                                                                                    isSearchable={false}
                                                                                    menuPortalTarget={document.body}
                                                                                    maxMenuHeight={200}
                                                                                    options={dataJenisDokumen}
                                                                                />

                                                                                :

                                                                                <Select {...input}
                                                                                    className="basic-single react-select"
                                                                                    classNamePrefix="select"
                                                                                    tabSelectsValue={false}
                                                                                    isDisabled={false}
                                                                                    isClearable={false}
                                                                                    isSearchable={false}
                                                                                    menuPortalTarget={document.body}
                                                                                    maxMenuHeight={200}
                                                                                    options={dataJenisDokumen?.filter(x => !x.label.match('Head Office Internal'))}
                                                                                />}
                                                                            <div className="text-danger">
                                                                                {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                                            </div>
                                                                        </React.Fragment>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div> */}

                                                    <div className="col-md-6">
                                                        <div className='form-group'>
                                                            <Field name="statusdokumen">
                                                                {({ input, meta }) => {
                                                                    return (
                                                                        <React.Fragment>
                                                                            <label className="col-form-label">Status Dokumen</label>
                                                                            <Select {...input}
                                                                                className="basic-single react-select"
                                                                                classNamePrefix="select"
                                                                                tabSelectsValue={false}
                                                                                isDisabled={false}
                                                                                isClearable={false}
                                                                                isSearchable={false}
                                                                                menuPortalTarget={document.body}
                                                                                maxMenuHeight={200}
                                                                                options={statusDokumenOptions}
                                                                            />
                                                                            <div className="text-danger">
                                                                                {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                                            </div>
                                                                        </React.Fragment>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group row">
                                                            <div className="col-md-6">
                                                                <label className="col-sm-3 col-form-label">Start Date</label>
                                                                <div className="col-sm-12">
                                                                    <DatePicker
                                                                        className="form-control"
                                                                        selected={startDate}
                                                                        onChange={(date: Date) => setStartDate(date)}
                                                                    />
                                                                </div>

                                                            </div>

                                                            <div className="col-md-6">
                                                                <label className="col-sm-3 col-form-label">End Date</label>
                                                                <div className="col-sm-12">
                                                                    <DatePicker
                                                                        className="form-control"
                                                                        selected={endDate}
                                                                        onChange={(date: Date) => setEndDate(date)}
                                                                    />
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>

                                                    <br />
                                                    <br />
                                                    <div className="hr-line-dashed"></div>
                                                    <div className="col-md-6 offset-md-3">
                                                        <br /><br /><br />
                                                        <button className=" btn btn-primary block full-width m-b" data-style="zoom-in" ><i className="fa fa-search" aria-hidden="true"></i> SEARCH</button>
                                                    </div>
                                                </form>
                                            )}
                                        />



                                    </div>


                                </div>

                                <div className="ibox-content">
                                    <div className="table-responsive">

                                        <div>
                                            <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                                className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />



                                            <br /><br /><br />
                                            <table id="mytableSort" className="table table-striped table-hover filterclass">
                                                <thead>
                                                    <tr className="showChecked">
                                                        <th className="bg-primary">Action</th>
                                                        <th className="bg-primary">Status Dokumen</th>
                                                        <th className="bg-primary">Jenis Dokumen</th>
                                                        <th className="bg-primary">Scope</th>
                                                        <th className="bg-primary">Kategori</th>
                                                        <th className="bg-primary">Sub Kategori</th>
                                                        <th className="bg-primary">Nomor</th>
                                                        <th className="bg-primary">Subject</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">
                                                    {resultListDokumenPengajuan?.length == 0 ?
                                                        <tr><td colSpan={8}><h2><b>Tidak Ada Data</b></h2></td></tr>

                                                        :

                                                        resultListDokumenPengajuan?.map(data =>
                                                            <tr>
                                                                <td className="">
                                                                    <div className="btn-group">
                                                                        <Button onClick={() => handleLinkToDetail(data.idDokumen)} className="btn btn-success" type="button"><i className="fa fa-info" aria-hidden="true"></i></Button>
                                                                    </div>
                                                                </td>
                                                                <td> <p><span className={data.statusDokumen == "Active" ? "label label-primary" : "label label-danger"} >{data.rejectedBy !== 0 ? 'Rejected By: ' + data.rejectName : data.statusDokumen}</span></p></td>
                                                                <td>{data.jenisDokumen}</td>
                                                                <td>{data.scopeDokumen}</td>
                                                                <td>{data.kategori}</td>
                                                                <td>{data.subKategori}</td>
                                                                <td>{data.nomor}</td>
                                                                <td>{data.subject}</td>
                                                            </tr>
                                                        )
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    linkToDetail ?
                        <>
                            return <Redirect push
                                to={{
                                    pathname: "/memo/detail/detailpengajuan",
                                    state: {
                                        pidd: IdDokumen,
                                        // pidj: IdJenisDokumenMask
                                    }
                                }}
                            />
                        </> : <></>
                }
            </div>
        </>
    );
};

export default {
    routeProps: {
        path: '/memo/list/listpengajuan',
        exact: true,
        component: ListPengajuan
    },
    name: 'ListPengajuan',
};