import React, { useContext, useEffect, useState } from 'react';
import { MemoRootStoreContext } from '../../../stores/MemoRootStore';
import { Form, Field } from "react-final-form";
import swal from "sweetalert";
import Alert from '../../../../../utils/alert';
import { getBagianName, getIdDivisi, getIdLogin, getIdUnitUsaha } from '../../../../../utils/loginuseraccess';
import Select from 'react-select';
import { IUnitUsaha } from '../../../../../models/CommonModel';
import { SelectListOptions, unitUsahaOptions } from '../../../models/MemoModel';
import { Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import moment from 'moment';
import SyncLoader from "react-spinners/SyncLoader";


const BuatMemo = () => {

    const memoRootStore = useContext(MemoRootStoreContext);
    const { getListJenisDokumen, getListKategoriDokumen, getListSubKategoriDokumen, getDokumenByNomor, buatDokumenIOM } = memoRootStore.memoStore;


    const [nomor, setNomor] = useState("")
    const [stateJenisDokumen, setStateJenisDokumen] = useState("");
    const [stateLabelJenisDokumen, setStateLabelJenisDokumen] = useState("");
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState(0)
    const [disable, setDisable] = useState(false)

    const [dataJenisDokumen, setDataJenisDokumen] = useState<SelectListOptions[]>();
    const [dataKategoriDokumen, setDataKategoriDokumen] = useState<SelectListOptions[]>();
    const [dataSubKategoriList, setDataSubKategoriList] = useState<SelectListOptions[]>();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const endDateAuto = new Date('2099-12-31');
    const [requestKategori, setRequestKategori] = useState(0);

    const [stateUnitUsahaSelected, setstateUnitUsahaSelected] = useState<SelectListOptions[]>([]);
    const [stateIsEndDateSelected, setstateIsEndDateSelected] = useState(0);


    const id_ms_login: Number = getIdLogin();
    const bagian: String = getBagianName();
    const id_ms_divisi: Number = getIdDivisi();
    const id_ms_unitusaha: Number = getIdUnitUsaha();

    const [file, setFile] = useState("");

    const saveFile = (event: any) => {
        setFile(event.target.files[0])
    }

    useEffect(() => {

        loadData()

        return () => {
        };
    }, []);


    // Load data detail PAS
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

    const selectDoc = (selectedId: any) => {

        if (stateUnitUsahaSelected.includes(selectedId)) {
            const newDocSelected = stateUnitUsahaSelected.filter((id) => id !== selectedId);
            setstateUnitUsahaSelected(newDocSelected);
        }
        else {
            const newDocSelected = [...stateUnitUsahaSelected];

            newDocSelected.push(selectedId);
            setstateUnitUsahaSelected(newDocSelected);

        }
    };

    const isEndDate = (isEndDateSelected: number) => {
        isEndDateSelected === 0 ? setstateIsEndDateSelected(1) : setstateIsEndDateSelected(0)
    };


    function nomorStr(nomorstr: string) {
        setNomor(nomorstr)

    }

    function jenisDokumen(selectedOptions: any) {
        const selectedValue = selectedOptions === null ? '' : selectedOptions.value
        const selectedLabel = selectedOptions === null ? '' : selectedOptions.label

        setStateLabelJenisDokumen(selectedLabel)
        setStateJenisDokumen(selectedValue)

    }

    function handleGetSubKategori(selectedOptions: any) {

        const selectedValue = selectedOptions === null ? '' : selectedOptions.value

        setRequestKategori(selectedValue)

        console.log(selectedValue)

        const SubKategoriList = getListSubKategoriDokumen(Number(selectedValue)).then(function (response) {
            if (response.statusCode === 200) {
                setDataSubKategoriList(response.result);
            }
        })

    }


    const [loadingSave, setLoadingSave] = useState(false);
    const handleFinalFormSubmit = (values: any) => {

        const { ...data } = values;

        const formData = new FormData();
        formData.append("IdUnitUsaha", String(id_ms_unitusaha));
        formData.append("FlagDokumen", 'IOM');
        formData.append("IdMsKategoriDokumen", String(requestKategori));
        formData.append("IdMsSubKategoriDokumen", String(data.subkategori.value));
        formData.append("IdJenisDokumen", String(stateJenisDokumen));
        formData.append("Nomor", data.nomor);
        formData.append("Subject", data.subject);
        formData.append("StartDate", String(moment(startDate).format('YYYY-MM-DD')));
        formData.append("EndDate", stateIsEndDateSelected === 1 ? String(moment(endDate).format('YYYY-MM-DD')) : String(moment(endDateAuto).format('YYYY-MM-DD')));
        formData.append("ModifiedBy", String(id_ms_login));
        formData.append("UnitUsahaDitujukan", JSON.stringify(stateUnitUsahaSelected));
        formData.append("file", file);


        setLoadingSave(true)

        const res = buatDokumenIOM(formData).then(function (response) {
            setMessage(response.message)
            setStatus(response.statusCode)
            if (response.statusCode == 200) {
                setLoadingSave(false)
                setDisable(true)
                swal("Berhasil input IOM!", "", "success");
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
        <div>
            <div className="row wrapper border-bottom white-bg page-heading">
                <div className="col-lg-10">
                    <h2>Buat IOM</h2>
                </div>
            </div>
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox ">
                            <div className="ibox-title">
                                <h5>Buat IOM</h5>
                            </div>
                            <div className="ibox-content">
                                {
                                    status != 0 ?
                                        <> <Alert message={message} status={status} /> </> : <> </>
                                }
                                <Form
                                    onSubmit={handleFinalFormSubmit}
                                    validate={values => {
                                        const errors: any = {};
                                        if (!values.subject) {
                                            errors.subject = "Subject is required";
                                        }

                                        if (!values.nomor) {
                                            errors.nomor = "Nomor is required";
                                        }

                                        if (!values.subkategori) {
                                            errors.subkategori = "Sub Kategori is required";
                                        }

                                        if (!values.fileupload) {
                                            errors.fileupload = "Tidak ada file.";
                                        }

                                        return errors;
                                    }}
                                    render={({ handleSubmit }) => (
                                        <form className="m-t" method="POST" onSubmit={handleSubmit}>
                                            <div className='form-group row'>

                                                <label className="col-sm-2 col-form-label">Jenis Dokumen</label>
                                                <div className="col-sm-6">

                                                    {bagian === 'JKT' ?

                                                        <Select
                                                            className="basic-single react-select"
                                                            classNamePrefix="select"
                                                            tabSelectsValue={false}
                                                            isDisabled={false}
                                                            isClearable={false}
                                                            isSearchable={false}
                                                            menuPortalTarget={document.body}
                                                            maxMenuHeight={200}
                                                            options={dataJenisDokumen?.filter(x => x.label.match('Head Office'))}
                                                            onChange={(value) => jenisDokumen(value)}
                                                        />

                                                        :

                                                        <Select
                                                            className="basic-single react-select"
                                                            classNamePrefix="select"
                                                            tabSelectsValue={false}
                                                            isDisabled={false}
                                                            isClearable={false}
                                                            isSearchable={false}
                                                            menuPortalTarget={document.body}
                                                            maxMenuHeight={200}
                                                            options={dataJenisDokumen?.filter(x => !x.label.match('Head Office'))}
                                                            onChange={(value) => jenisDokumen(value)}
                                                        />}

                                                </div>
                                            </div>

                                            <div className='form-group row'>
                                                <label className="col-sm-2 col-form-label">Kategori</label>
                                                <div className="col-sm-6">
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
                                                        onChange={(selectedOptionVal) => handleGetSubKategori(selectedOptionVal)}
                                                    />
                                                </div>
                                            </div>

                                            <div className='form-group row'>
                                                <Field name="subkategori">
                                                    {({ input, meta }) => {
                                                        return (
                                                            <React.Fragment>
                                                                <label className="col-sm-2 col-form-label">Sub Kategori</label>
                                                                <div className="col-sm-6">
                                                                    <Select {...input}
                                                                        className="basic-single react-select"
                                                                        classNamePrefix="select"
                                                                        tabSelectsValue={false}
                                                                        isDisabled={false}
                                                                        isClearable={false}
                                                                        isSearchable={false}
                                                                        menuPortalTarget={document.body}
                                                                        maxMenuHeight={200}
                                                                        options={dataSubKategoriList}
                                                                    />
                                                                </div>
                                                                <div className="text-danger">
                                                                    {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                                </div>
                                                            </React.Fragment>
                                                        );
                                                    }}
                                                </Field>
                                            </div>

                                            <div className="form-group row">
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
                                            <div className="form-group row">
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

                                            <div className="form-group row">
                                                <label className="col-sm-2 col-form-label">Start Date</label>
                                                <div className="col-sm-6">
                                                    <DatePicker
                                                        className="form-control"
                                                        selected={startDate}
                                                        onChange={(date: Date) => setStartDate(date)}
                                                    />
                                                </div>
                                            </div>

                                            <div className='form-group row'>
                                                <label className="col-sm-2 col-form-label"></label>
                                                <div className='col-md-6'>
                                                    <label className="checkboxcontainer">
                                                        <input
                                                            value={stateIsEndDateSelected}
                                                            onChange={() => isEndDate(stateIsEndDateSelected)}
                                                            type="checkbox"
                                                            checked={stateIsEndDateSelected === 1 ? true : false}
                                                        />

                                                        <span className="checkmark"></span>
                                                        Apa ada tanggal akhir IOM?
                                                    </label>
                                                </div>
                                            </div>

                                            {stateIsEndDateSelected === 1 ?

                                                <div className="form-group row">
                                                    <label className="col-sm-2 col-form-label">End Date</label>
                                                    <div className="col-sm-6">
                                                        <DatePicker
                                                            className="form-control"
                                                            selected={endDate}
                                                            onChange={(date: Date) => setEndDate(date)}
                                                        />
                                                    </div>
                                                </div>

                                                : ''}

                                            <br />

                                            <div className="form-group row">
                                                <Field name="fileupload" onBlur={saveFile}>
                                                    {({ input, meta }) => {
                                                        return (

                                                            <React.Fragment>
                                                                <label className="col-sm-2 col-form-label">Upload Doc</label>
                                                                <div className="col-sm-6">
                                                                    <Field onBlur={saveFile} name="fileupload" accept=".pdf,.jpg,.jpeg,.png" component="input" className="form-control" type="file" multiple />
                                                                </div>

                                                                <div className="text-danger">
                                                                    {meta.error && meta.touched && (<span>{meta.error}</span>)}
                                                                </div>
                                                            </React.Fragment>
                                                        );
                                                    }}
                                                </Field>
                                            </div>

                                            {stateLabelJenisDokumen === "IOM Head Office External PT" ?

                                                <div>
                                                    <br /><br /><br />

                                                    <div className="row col-md-9">
                                                        {unitUsahaOptions.map(data =>
                                                            <div className="col-lg-3">
                                                                <label className="checkboxcontainer">
                                                                    <input
                                                                        value={data.value}
                                                                        onChange={() => selectDoc(data)}
                                                                        type="checkbox"
                                                                        checked={stateUnitUsahaSelected.includes(data) ? true : false}
                                                                    />

                                                                    <span className="checkmark"></span>
                                                                    {data.label}
                                                                </label>
                                                            </div>

                                                        )}

                                                    </div>
                                                </div>

                                                :

                                                ''}

                                            <br />
                                            <div className="hr-line-dashed"></div>

                                            {
                                                loadingSave === true ?

                                                // className="text-center"
                                                    <div>  
                                                        <div style={{ padding: "50px" }}>
                                                            <SyncLoader color={"#1ab394"} loading={loadingSave} />
                                                        </div>

                                                    </div>

                                                    :

                                                    <div className="form-group row">
                                                        <div className="col-sm-3">
                                                            <button disabled={disable} className="btn btn-block btn-primary" type="submit">Save</button>
                                                        </div>
                                                    </div>
                                            }

                                        </form>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default {
    routeProps: {
        path: '/memo/create/buatmemo',
        exact: true,
        component: BuatMemo
    },
    name: 'BuatMemo',
};