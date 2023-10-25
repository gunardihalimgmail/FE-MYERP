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
import { IPasList } from "../../models/PasListModel";
import { AgronomiRootStoreContext } from "../../stores/AgronomiRootStore";


const PASPeriodeIni = () => {
    const modulname = 'agronomi'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'List Periode Ini';


    const [dataPasIni, setDataPASIni] = useState<IPasList[]>();
    // const [modalData, setModalData] = useState<BKUDetailOPLPB>();

    const agronomiRootStore = useContext(AgronomiRootStoreContext);
    const { getDataPeriode } = agronomiRootStore.pasStore;


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

    // Load data list PAS Ini
    function loadData() {
        const PeriodeIniList = getDataPeriode("INI").then(function (response) {
            if (response.statusCode === 200) {
                setDataPASIni(response.result);
            }
        })
    }


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Masalah dan Alt. Solusi Periode Ini</h2>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>List Masalah dan Alt. Solusi Periode Ini</h5>
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
                                            <Link className="btn btn-secondary btn-block" to="/agronomi/list/listpashistory" ><i className="fa fa-lg fa-search" aria-hidden="true"></i> &nbsp; <span style={{ fontSize: "15px" }} >HISTORY</span>     </Link>
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
                                                    {dataPasIni?.length == 0 ?
                                                        <tr><td colSpan={9}><h2><b>Tidak Ada Data</b></h2></td></tr>

                                                        :

                                                        dataPasIni?.map(data => (
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

export default {
    routeProps: {
        path: '/agronomi/list/listpasperiodeini',
        exact: true,
        component: PASPeriodeIni
    },
    name: 'PASPeriodeIni',
};