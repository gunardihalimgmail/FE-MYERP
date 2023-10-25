import React, { useContext, useEffect, useState } from 'react';
import { RootStoreContext } from '../../../../../stores/RootStore';
import { Form, Field } from "react-final-form";
import swal from "sweetalert";
import Alert from '../../../../../utils/alert';
import { getIdLogin, getIdUnitUsaha, getUnitUsahaSelectList } from '../../../../../utils/loginuseraccess';
import Select from 'react-select';
import { IUnitUsaha } from '../../../../../models/CommonModel';
import { Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import { MemoRootStoreContext } from '../../../stores/MemoRootStore';
import { divisiOptions, SelectListOptions } from '../../../models/MemoModel';
import moment from 'moment';
import SyncLoader from "react-spinners/SyncLoader";

const BuatPengajuan = () => {

    const memoRootStore = useContext(MemoRootStoreContext);
    const { getDokumenByNomor, getListKategoriDokumen, getListSubKategoriDokumen, buatDokumenIOM } = memoRootStore.memoStore;

    const [nomor, setNomor] = useState("")
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState(0)
    const [disable, setDisable] = useState(false)

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [requestKategori, setRequestKategori] = useState(0);
    const [dataKategoriDokumen, setDataKategoriDokumen] = useState<SelectListOptions[]>();
    const [dataSubKategoriList, setDataSubKategoriList] = useState<SelectListOptions[]>();

    const id_ms_login: Number = getIdLogin();
    const unitUsahaList: IUnitUsaha[] = getUnitUsahaSelectList();
    const id_ms_unitusaha: Number = getIdUnitUsaha();

    const [stateDivisiSelected, setstateDivisiSelected] = useState<SelectListOptions[]>([]);

    console.log(stateDivisiSelected);

    const [file, setFile] = useState("");

    const saveFile = (event: any) => {
        setFile(event.target.files[0])
    }


    useEffect(() => {

        loadData()

        return () => {
        };
    }, []);


    function loadData() {

        const KategoriList = getListKategoriDokumen().then(function (response) {
            if (response.statusCode === 200) {
                setDataKategoriDokumen(response.result);
            }
        })
    }

    function nomorStr(nomorstr: string) {
        setNomor(nomorstr)

    }

    const selectDoc = (selectedId: any) => {

        if (stateDivisiSelected.includes(selectedId)) {
            const newDocSelected = stateDivisiSelected.filter((id) => id !== selectedId);
            setstateDivisiSelected(newDocSelected);
        }
        else {
            const newDocSelected = [...stateDivisiSelected];

            newDocSelected.push(selectedId);
            setstateDivisiSelected(newDocSelected);

        }
    };


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

        if (stateDivisiSelected.length == 0) {
            swal("Divisi harus di isi", "", "warning");
        } else {
            const formData = new FormData();
            formData.append("IdUnitUsaha", String(id_ms_unitusaha));
            formData.append("FlagDokumen", 'Pengajuan');
            formData.append("IdMsKategoriDokumen", String(requestKategori));
            formData.append("IdMsSubKategoriDokumen", String(data.subkategori.value));
            formData.append("Nomor", data.nomor);
            formData.append("Subject", data.subject);
            formData.append("StartDate", String(moment(startDate).format('YYYY-MM-DD')));
            formData.append("EndDate", String(moment(endDate).format('YYYY-MM-DD')));
            formData.append("ModifiedBy", String(id_ms_login));
            formData.append("DivisiDitujukan", JSON.stringify(stateDivisiSelected));
            formData.append("file", file);


            setLoadingSave(true)
            const res = buatDokumenIOM(formData).then(function (response) {
                setMessage(response.message)
                setStatus(response.statusCode)
                if (response.statusCode == 200) {
                    setLoadingSave(false)
                    setDisable(true)
                    swal("Berhasil input pengajuan!", "", "success");
                }
            })
        }
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
                    <h2>Buat Pengajuan</h2>
                </div>
            </div>
            <div className="wrapper wrapper-content animated fadeInRight">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ibox ">
                            <div className="ibox-title">
                                <h5>Buat Pengajuan</h5>
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

                                            <div className='form-group  row'>
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

                                            <div className='form-group  row'>
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


                                            <div className="form-group  row">
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

                                            <br /><br /><br />

                                            <div className="row col-md-9">
                                                {divisiOptions.map(data =>
                                                    <div className="col-lg-3">
                                                        <label className="checkboxcontainer">
                                                            <input
                                                                value={data.value}
                                                                onChange={() => selectDoc(data)}
                                                                type="checkbox"
                                                                checked={stateDivisiSelected.includes(data) ? true : false}
                                                            />

                                                            <span className="checkmark"></span>
                                                            {data.label}
                                                        </label>
                                                    </div>

                                                )}

                                            </div>




                                            <br />
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default {
    routeProps: {
        path: '/memo/create/buatpengajuan',
        exact: true,
        component: BuatPengajuan
    },
    name: 'BuatPengajuan',
};