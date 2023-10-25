import { useContext, useEffect, useState } from "react";
import MaterialReactTable, {
    MRT_ColumnDef
} from 'material-react-table';
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import SyncLoader from "react-spinners/SyncLoader";
import { Field, Form } from "react-final-form";
import React from "react";
import { FinanceRootStoreContext } from "../../../stores/FinanceRootStore";
import { IOpsiTujuanList, IResultDataListKirimTerima, ISPDKirimTerimaList } from "../../../models/ApprovalSPDModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";
import Select from 'react-select';
import { useLocation } from "react-router-dom";
import { loadjs, removeCustomjs } from "../../../../../utils/others";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";


const KirimOutstandingSPD = () => {
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'Kiriman Belum Diterima';

    const [expanded, setExpanded] = React.useState<boolean | false>(true);
    const [showAllOrChecked, setShowAllOrChecked] = React.useState<string>('checked')   // checked or all (posisi button)
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState<ISPDKirimTerimaList[]>([]);

    const [dataSPDKirimNotTerima, setDataSPDKirimNotTerima] = useState<ISPDKirimTerimaList[]>([]);
    // const [modalData, setModalData] = useState<BKUDetailOPLPB>();

    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataSPDKirimNotTerima } = financeRootStore.approvalSPDStore;

    var id = new URLSearchParams(useLocation().search);
    const id_ms_login_link = id.get("id_ms_login");


    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: Number = getIdLogin();


    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulname, formName);
    // console.log(user_access)


    useEffect(() => {

        // refresh data setelah transaksi
        loadData();
        // loadjs();'
        loadjs('custom.js');

        return () => {
            removeCustomjs('custom.js')
        }

    }, []);

    let column:any = [
        {
            accessorKey: 'id',
            header: 'id',
            size: 40,
            enableHiding: false,  // disable column agar tidak tampil di tabel
        },
        {
            accessorKey: 'nomor', 
            header: 'Nomor',
            size: 200,
            enableColumnOrdering: true,    // enable move column
            enableColumnDragging: true
        },
        {
            accessorKey: 'pt',
            header: 'PT',
            size:100,
            enableColumnOrdering: true,
            enableColumnDragging: true,
            enableColumnFilter : true  // individual column filter
            //   Cell: ({cell})=>new Date(cell.getValue<Date>()).getDate() + " " + new Date(cell.getValue<Date>()).getMonth() + " " + new Date(cell.getValue<Date>()).getFullYear()
        },
        {
            accessorKey: 'perihal',
            header: 'Perihal',
            size:500,
            enableColumnOrdering: true,
            enableColumnDragging: true,
            Cell: ({cell})=>(  // contoh input-an di dalam cell
                <span style = {{whiteSpace:'normal'}}>{cell.row.original.perihal}</span>
            )
        },
        {
            accessorKey: 'flowType',
            header: 'Ditujukan',
            enableColumnOrdering: true,
            enableColumnDragging: true
        },
        {
            accessorKey: 'requestByName',
            header: 'Request By',
            Cell: ({cell}) => (
                <span style = {{whiteSpace:'normal'}}>{cell.row.original.requestByName}</span>
            )
        },
        {
            accessorKey: 'requestTimeStr',
            // accessorFn for sorting and filtering
            // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
            id: 'requestTimeStr',
            header: 'Request Time',
            Cell: ({ cell }) => (
                    <span style = {{whiteSpace:'normal'}}>
                        {cell.row.original.requestTimeStr}
                        {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                    </span>
            )
        },
        {
            accessorKey: 'pic',
            header: 'Status',
            Cell: ({ cell }) => (
                <span style = {{whiteSpace:'normal'}}>
                    {cell.row.original.pic}
                    {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                </span>
            )
        },
        {
            accessorKey: 'statusByName',
            header: 'Sent By',
            Cell: ({ cell }) => (
                <span style = {{whiteSpace:'normal'}}>
                    {cell.row.original.statusByName}
                    {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                </span>
            )
        },
        {
            accessorKey: 'statusTimeStr',
            header: 'Sent Time'
        },

    ]

    // function loadjs() {

    //     const timer = setTimeout(() => {
    //         const script = document.createElement("script");
    //         script.src = "js/custom.js";
    //         script.async = true;
    //         document.body.appendChild(script);
    //     }, 300);
    //     return () => {
    //         // window.removeEventListener("keypress", handleKeyPress);
    //         clearTimeout(timer);
    //     }
    // }


    // Load data list BKU dan Akun
    function loadData() {

        const SPDKirimList = getDataSPDKirimNotTerima(id_ms_login_link == null ? id_ms_login : id_ms_login_link).then(responseSPDKirimNotTerima => {
            setDataSPDKirimNotTerima(responseSPDKirimNotTerima.result);
            setData(responseSPDKirimNotTerima.result);
            // loadjs('custom.js');
        })
    }

    const handleChangeAccordion = 
        (panel:string) => (event: React.SyntheticEvent, isExpanded: boolean) =>
    {
        if (isExpanded){
            // jika terbuka maka reload kembali jquery nya
            removeCustomjs('custom.js')
            loadjs('custom.js')

            // posisi sekarang 'all' waktu expand, berarti data yang muncul ter-checked
            // if (showAllOrChecked == 'all'){
                
            //     // const rows = $("#mytableSort tr")
            //     setTimeout(()=>{
            //         let rows = document.querySelectorAll<HTMLTableRowElement>("#mytableSort tbody tr")
            //         rows.forEach(row=>{
            //             if (!row.classList.contains("showChecked")){
            //                 row.style.display = 'none'
            //             }
            //         })
            //     })

            // }
        }
    }




    return (
        <>
            <div>
                {/* <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>Kiriman Belum Diterima</h2>
                    </div>
                </div> */}

                <div style = {{marginBottom:'50px'}}>
                    <MaterialReactTable
                        columns={column}
                        data={data}
                        displayColumnDefOptions={{
                            'mrt-row-select': {
                                enableColumnActions: false, // matikan opsi menu titik tiga
                                header:'Select'
                            },
                            // 'mrt-row-actions':{
                            //     header: 'Detail'
                            // }
                        }}
                        enableEditing={true}
                        enablePagination={data.length > 0 ? true : false}
                        enableDensityToggle={true}
                        enableColumnResizing={true}
                        enableRowNumbers
                        rowNumberMode="original"
                        // muiSelectCheckboxProps={({row})=>({ // pada saat click check selection
                        //     onClick: (event) => {
                        //         alert(row.original.nomor + " -> " + event.target?.['checked'])
                        //     }
                        // })}
                        // muiTableBodyRowProps={({row})=>({   // pada saat click satu row
                        //     onClick: row.getToggleSelectedHandler(),
                        //     sx:{cursor:'pointer'}
                        // })}
                        enableMultiRowSelection={true}  // multi select
                        initialState={{ 
                            density: 'compact',
                            columnVisibility: { id: false, 
                                        detail: (id_ms_login != 2 && id_ms_login != 3 && id_ms_login != 4 && id_ms_login != 1587) ? true : false,
                                        dirNotes: id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ? true : false,
                                    },
                            showGlobalFilter: true,
                            columnOrder:[
                                'mrt-row-numbers',
                                'nomor',
                                'pt',
                                'perihal',
                                'flowType',    // ditujukan
                                'requestByName',
                                'requestTimeStr',
                                'pic',
                                'statusByName',
                                'statusTimeStr'
                            ]
                        }}
                        muiTableBottomToolbarProps={{
                            sx:{
                                '.MuiInputBase-root':{
                                    marginTop:'-12px'
                                },
                                '.MuiTablePagination-displayedRows':{
                                    marginTop:'6px'
                                },
                                '.MuiTablePagination-actions': {
                                    marginBottom:'12px'
                                }
                            }
                        }}
                        muiTableHeadCellProps={{
                            sx:{
                                backgroundColor:'transparent',
                                color: 'black'
                            }
                        }}
                        enableColumnFilters={true}
                        muiTableBodyProps={{
                            sx:{
                                '& tr:nth-of-type(even)': {
                                    backgroundColor: 'beige'
                                }
                            }
                        }}
                        muiTablePaginationProps={{
                            rowsPerPageOptions: [5,10,15,20,50, {value: data.length, label: 'All'}],
                            showFirstButton: true,  
                            showLastButton: true
                        }}
                        muiTableHeadCellFilterTextFieldProps={{
                            sx:{
                                '.MuiInputBase-input':{
                                    color: 'black'
                                }
                            },
                            variant:'standard'  // bentuk filter text
                        }}
                        muiSearchTextFieldProps={{
                            size:'small',
                            variant: 'standard',
                            label: '',
                            InputLabelProps: { shrink: true }
                        }}  // search global di kanan atas
                        enableSelectAll={false}
                        enableRowSelection = {false}
                        enableGlobalFilterChangeMode={true}
                        enableColumnFilterChangeMode={true}
                        enableColumnOrdering={true}
                        enableRowActions={false}     // kolom 'Actions'
                        state = {{ showSkeletons: loader}}
                        positionToolbarAlertBanner="top"
                    />
                </div>

                {/* <div className="wrapper wrapper-content animated fadeInRight"> */}
                    {/* <div className="row  border-bottom white-bg dashboard-header"> */}
                        {/* <div className="col-lg-12"> */}

                            {/* <Accordion defaultExpanded={expanded} 
                                            TransitionProps={{ unmountOnExit: true }}
                                            onChange={handleChangeAccordion('panel1')}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <h5>Kiriman Belum Diterima List</h5>
                                </AccordionSummary>

                                <AccordionDetails>

                                            <div className="table-responsive">

                                                <div>
                                                    <input autoComplete="off" style={{ borderRadius: "4px", border: "1px solid green", alignItems: "center" }}
                                                        className="col-md-6 form-control float-right" id="myInput" type="text" placeholder="Search.." />

                                                    <br /><br /><br />
                                                    <table id="mytableSort" className="table table-striped table-hover css-serial filterclass">
                                                        <thead>
                                                            <tr className="showChecked">
                                                                <th className="bg-primary">#</th>
                                                                <th className="bg-primary">Nomor</th>
                                                                <th className="bg-primary">PT</th>
                                                                <th className="bg-primary">Perihal</th>
                                                                <th className="bg-primary">Ditujukan</th>
                                                                <th className="bg-primary">Request By</th>
                                                                <th className="bg-primary">Request Time</th>
                                                                <th className="bg-primary">Status</th>
                                                                <th className="bg-primary">Sent by</th>
                                                                <th className="bg-primary">Sent Time</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody id="myTable">
                                                            {dataSPDKirimNotTerima.map(data => (
                                                                <tr>
                                                                    <td></td>
                                                                    <td>{data.nomor}</td>
                                                                    <td>{data.pt}</td>
                                                                    <td>{data.perihal}</td>
                                                                    <td>{data.flowType}</td>
                                                                    <td>{data.requestByName}</td>
                                                                    <td>{data.requestTimeStr}</td> 
                                                                    <td>{data.pic}</td> 
                                                                    <td>{data.statusByName}</td> 
                                                                    <td>{data.statusTimeStr}</td> 

                                                                </tr>
                                                            ))}

                                                        </tbody>

                                                    </table>
                                                </div>

                                            </div>


                                </AccordionDetails>

                            </Accordion> */}

                            {/* <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Kiriman Belum Diterima List</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="ibox-content">
                                <div></div>
                            </div>
                            <div className="ibox-content">
                            </div> */}

                        {/* </div> */}
                    {/* </div> */}
                {/* </div> */}
            </div>

        </>
    );
};

export default {
    routeProps: {
        path: '/finance/approval/kirimdokumenoutstandingspd',
        exact: true,
        component: KirimOutstandingSPD
    },
    name: 'KirimOutstandingSPD',
};