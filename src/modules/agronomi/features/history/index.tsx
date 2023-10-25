import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { getIdLogin, getUserAccess } from "../../../../utils/loginuseraccess";
import SyncLoader from "react-spinners/SyncLoader";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Field, Form } from "react-final-form";
import React from "react";
import ButtonLoader from "../../../../component/button/buttonloader";
import { Link } from "react-router-dom";
import Select from 'react-select';
import Alert from "../../../../utils/alert";
import { AgronomiRootStoreContext } from "../../stores/AgronomiRootStore";
import { AgPasOptions, IPasList } from "../../models/PasListModel";


const PASHistory = () => {
    const modulname = 'agronomi'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'List History';

    const [message, setMessage] = useState("");
    const [status, setStatus] = useState(0);

    const [dataPasHistory, setDataPASHistory] = useState<IPasList[]>();
    const [dataPeriodeList, setDataPeriodeList] = useState<AgPasOptions[]>([]);
    const [dataPtList, setDataPtList] = useState<AgPasOptions[]>();
    const [dataMingguList, setDataMingguList] = useState<AgPasOptions[]>([]);
    const [requestPeriode, setRequestPeriode] = useState(0);
    const [requestMinggu, setRequestMinggu] = useState<AgPasOptions[]>([]);
    const [requestPT, setRequestPT] = useState<AgPasOptions[]>([]);

    // const [modalData, setModalData] = useState<BKUDetailOPLPB>();

    const agronomiRootStore = useContext(AgronomiRootStoreContext);
    const { getDataPeriode, getPeriodeList, getOpsiPtList, getMingguList, getHistoryList } = agronomiRootStore.pasStore;


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

        const PeriodeList = getPeriodeList().then(function (response) {
            if (response.statusCode === 200) {
                setDataPeriodeList(response.result);
            }
        })

        const OpsiPtList = getOpsiPtList().then(function (response) {
            if (response.statusCode === 200) {
                setDataPtList(response.result);
            }
        })
    }


    function handleGetMinggu(selectedOptions: any) {

        const selectedValue = selectedOptions === null ? '' : selectedOptions.value

        setRequestPeriode(selectedValue)

        console.log(selectedValue)

        const PeriodeList = getMingguList(Number(selectedValue)).then(function (response) {
            if (response.statusCode === 200) {
                setDataMingguList(response.result);
            }
        })

    }


    function addOpsiMingguKe(selectedOptions: any) {

        setRequestMinggu(selectedOptions)
        console.log(selectedOptions)

    }

    function addOpsiPT(selectedOptions: any) {

        setRequestPT(selectedOptions)
        console.log(selectedOptions)

    }


    function handleSubmit() {


        let searchRequest = {
            Periode: Number(requestPeriode),
            MingguKe: requestMinggu,
            PT: requestPT
        };

        if (searchRequest.Periode == 0) {
            swal("Pilih Periode terlebih dahulu.", "", "warning");
        } else if (searchRequest.MingguKe == null || searchRequest.MingguKe.length == 0) {
            swal("Pilih Minggu terlebih dahulu.", "", "warning");
        } else if (searchRequest.PT == null || searchRequest.PT.length == 0) {
            swal("Pilih PT terlebih dahulu.", "", "warning");
        } else {
            const searchHistory = getHistoryList(searchRequest).then(function (response) {
                if (response?.statusCode === 200) {
                    setDataPASHistory(response.result)
                    loadData();
                    loadjs();
                } else {
                    swal("Gagal search dokumen!", "", "error");
                }
            });
        }


        console.log(searchRequest)


    }


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Masalah dan Alt. Solusi History</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>List Masalah dan Alt. Solusi History</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="ibox-content">
                                    <div className="row col-md-6 offset-md-3">
                                        <div className="col-md-12">
                                            <Link className="btn btn-secondary btn-block" to="/agronomi/list/listpasperiodeini" ><i className="fa fa-lg fa-clock-o" aria-hidden="true"></i> &nbsp; <span style={{ fontSize: "15px" }} >PERIODE INI</span> &nbsp; </Link>
                                        </div>

                                        <br />
                                        <br />

                                        <div className="col-md-12">
                                            <Link className="btn btn-secondary btn-block" to="/agronomi/list/listpasperiodelalu" > <i className="fa fa-lg fa-history" aria-hidden="true"></i> &nbsp; <span style={{ fontSize: "15px" }} >PERIODE LALU</span> </Link>
                                        </div>

                                        <br />
                                        <br />

                                        <div className="col-md-12">
                                            <Link className="btn btn-secondary btn-block" to="/agronomi/list/listpashistory" ><i className="fa fa-lg fa-search" aria-hidden="true"></i> &nbsp; <span style={{ fontSize: "15px" }} >HISTORY</span> </Link>
                                        </div>

                                    </div>

                                    <br />
                                    <br />

                                    <div className="text-center">
                                        <h2 >KRITERIA PENCARIAN</h2>
                                    </div>




                                    <div className="m-t">
                                        <div className="col-md-6 offset-md-3">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-form-label" htmlFor="order_id">Periode</label>


                                                    <Select
                                                        required
                                                        name="Periode"
                                                        className="basic-single col-md-12"
                                                        classNamePrefix="select"
                                                        tabSelectsValue={true}
                                                        isDisabled={false}
                                                        isClearable={false}
                                                        isSearchable={false}
                                                        menuPortalTarget={document.body}
                                                        options={dataPeriodeList}
                                                        // isLoading={loading}
                                                        maxMenuHeight={200}
                                                        // value={"data.flowType"}
                                                        onChange={(selectedOptionVal) => handleGetMinggu(selectedOptionVal)}
                                                    />

                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-form-label" htmlFor="status">Minggu Ke-</label>

                                                    <Select
                                                        name="MingguKe"
                                                        closeMenuOnSelect={false}
                                                        isMulti
                                                        className="basic-multi-select col-md-12"
                                                        classNamePrefix="select"
                                                        tabSelectsValue={true}
                                                        isDisabled={false}
                                                        isClearable={true}
                                                        isSearchable={false}
                                                        menuPortalTarget={document.body}
                                                        options={dataMingguList}
                                                        // isLoading={loading}
                                                        maxMenuHeight={200}
                                                        // value={"data.flowType"}
                                                        onChange={(selectedOptionVal) => addOpsiMingguKe(selectedOptionVal)}
                                                    />

                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="col-form-label" htmlFor="customer">Pilih PT</label>

                                                    <Select
                                                        name="PT"
                                                        closeMenuOnSelect={false}
                                                        isMulti
                                                        className="basic-multi-select col-md-12"
                                                        classNamePrefix="select"
                                                        tabSelectsValue={true}
                                                        isDisabled={false}
                                                        isClearable={true}
                                                        isSearchable={false}
                                                        menuPortalTarget={document.body}
                                                        options={dataPtList}
                                                        maxMenuHeight={200}
                                                        onChange={(selectedOptionVal) => addOpsiPT(selectedOptionVal)}
                                                    />
                                                </div>
                                            </div>

                                            <Button onClick={handleSubmit} className=" btn btn-primary block full-width m-b" data-style="zoom-in" ><i className="fa fa-search" aria-hidden="true"></i> SEARCH</Button>
                                        </div>

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
                                                        <th className="bg-primary">#</th>
                                                        <th className="bg-primary">PT</th>
                                                        <th className="bg-primary">Periode</th>
                                                        <th className="bg-primary">Minggu Ke-</th>
                                                        <th className="bg-primary">Tanggal</th>
                                                        <th className="bg-primary">Problem</th>
                                                        <th className="bg-primary">Area Problem</th>
                                                        <th className="bg-primary">Tanggapan GM</th>
                                                        <th className="bg-primary">Alternatif Solusi Agronomi</th>

                                                    </tr>
                                                </thead>
                                                <tbody id="myTable">
                                                    {dataPasHistory?.length == 0 ?
                                                        <tr><td colSpan={8}><h2><b>Tidak Ada Data</b></h2></td></tr>
                                                        :
                                                        dataPasHistory?.map(data => (
                                                            <tr>
                                                                <td></td>
                                                                <td>{data.pt}</td>
                                                                <td>{data.periode}</td>
                                                                <td>{data.mingguke}</td>
                                                                <td>{data.datedesc}</td>
                                                                <td>{data.deskripsiagro}</td>
                                                                <td>
                                                                    <div className="row col-md-12">

                                                                        <div className="col-md-4">
                                                                            <Link to={`/agronomi/detail/detailproblemkebun?id_ag_pas=${data.id_ag_pas}`} className={data.isproblemagro == true ? "btn btn-danger dim" : data.isproblemagro == false ? "btn btn-primary dim" : "btn btn-warning dim"} type="button">A</Link>
                                                                        </div>

                                                                        <br /><br />

                                                                        <div className="col-md-4">
                                                                            <Link to={`/agronomi/detail/detailproblemkebun?id_ag_pas=${data.id_ag_pas}`} className={data.isproblemhrdstrategic == true ? "btn btn-danger dim" : data.isproblemhrdstrategic == false ? "btn btn-primary dim" : "btn btn-warning dim"} type="button">H</Link>
                                                                        </div>

                                                                        <br /><br />

                                                                        <div className="col-md-4">
                                                                            <Link to={`/agronomi/detail/detailproblemkebun?id_ag_pas=${data.id_ag_pas}`} className={data.isproblemhrdoperational == true ? "btn btn-danger dim" : data.isproblemhrdoperational == false ? "btn btn-primary dim" : "btn btn-warning dim"} type="button">O</Link>
                                                                        </div>

                                                                        <br /><br />

                                                                        <div className="col-md-4">
                                                                            <Link to={`/agronomi/detail/detailproblemkebun?id_ag_pas=${data.id_ag_pas}`} className={data.isproblemteknik == true ? "btn btn-danger dim" : data.isproblemteknik == false ? "btn btn-primary dim" : "btn btn-warning dim"} type="button">T</Link>
                                                                        </div>

                                                                        <br /><br />

                                                                        <div className="col-md-4">
                                                                            <Link to={`/agronomi/detail/detailproblemkebun?id_ag_pas=${data.id_ag_pas}`} className={data.isproblembnc == true ? "btn btn-danger dim" : data.isproblembnc == false ? "btn btn-primary dim" : "btn btn-warning dim"} type="button">B</Link>
                                                                        </div>

                                                                        

                                                                    </div>

                                                                </td>
                                                                <td>{data.pendapatgm}</td>
                                                                <td>{data.altsolusiagro}</td>
                                                            </tr>
                                                        ))
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
            </div>
        </>
    );
};

export default PASHistory;