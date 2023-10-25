import { useContext, useEffect, useState } from "react";
import swal from "sweetalert";
import { Modal, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import SyncLoader from "react-spinners/SyncLoader";
import { Field, Form } from "react-final-form";
import React from "react";
import { RootStoreContext } from "../../../../../stores/RootStore";
import { FinanceRootStoreContext } from "../../../stores/FinanceRootStore";
import { getIdLogin, getUnitUsahaSelectList, getUserAccess } from "../../../../../utils/loginuseraccess";
import { IUnitUsaha } from "../../../../../models/CommonModel";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import moment from "moment";
import MaterialReactTable, {MRT_ColumnDef} from "material-react-table";
import LaddaButton, {S, SLIDE_UP} from 'react-ladda'

// import required css from library
import "react-datepicker/dist/react-datepicker.css";
import { ISPDList, ISPDListDetail } from "../../../models/ListSPDModel";
import { Accordion, AccordionDetails, AccordionSummary, Alert } from "@mui/material";
import { funcShowCheckedOrAll, loadjs, removeCustomjs } from "../../../../../utils/others";
import { ExpandMore } from "@mui/icons-material";
import { svgCustom } from "../../../../../utils/svgcustom";
import { MultiSelect } from "react-multi-select-component";
import { ISPDKirimTerimaList } from "../../../models/ApprovalSPDModel";

const ListSPD = () => {
    const modulname = 'finance'; // Data harus sama dengan yg ada di Ms_Module AppRole
    const formName = 'List SPD';

    const [expanded, setExpanded] = React.useState<boolean | false>(true);
    const [showAllOrChecked, setShowAllOrChecked] = React.useState<string>('checked')   // checked or all (posisi button)
    const [unitUsahaAccordion, setUnitUsahaAccordion] = React.useState<any>(null);
    const [keywordAccordion, setKeywordAccordion] = React.useState<string>('');
    const [noResult, setNoResult] = React.useState<boolean>();   // indikator kalau ada klik search dan jika tidak ada data maka tampilkan warning alert
    const [alertTanggal, setAlertTanggal] = React.useState<boolean>();   // indikator kalau ada klik search dan jika tanggal awal > tanggal akhir maka tampilkan warning alert

    const [loading, setLoading] = useState(false);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState<ISPDKirimTerimaList[]>([]);

    const financeRootStore = useContext(FinanceRootStoreContext);
    const { getDataHistorySPD, getDataHistorySPDDetail } = financeRootStore.listApprovalSPDStore;

    const rootStore = useContext(RootStoreContext);
    const { getUnitUsahaKode } = rootStore.commonStore;

    // State
    // Init DropDown
    const [listUnitUsaha, setListUnitUsaha] = useState<IUnitUsaha[]>([]);
    // Init Search
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    // const [selectedUnitUsaha, setSelectedUnitUsaha] = useState<IUnitUsaha[]>([]);
    // Array Result --> useState
    const [listHistorySPD, setListHistorySPD] = useState<ISPDList[]>([])
    // Declare value for hide / show Modal Form
    const [show, setShow] = useState(false);
    // Set State for Details
    const [nomor, setNomor] = useState(String);
    const [modalData, setModalData] = useState<ISPDListDetail[]>([]);

    // Decrypt Login Data untuk get is_ms_login
    const id_ms_login: number = getIdLogin();

    const unitUsahaList: IUnitUsaha[] = getUnitUsahaSelectList();
    
    const [valUnitUsaha, setValUnitUsaha] = React.useState<IUnitUsaha[]>([])

    // Decrypt menu untuk get user akses
    const user_access: any = getUserAccess(modulname, formName);
    
    useEffect(() => {

        const list = getUnitUsahaKode().then(function (response) {
            if (response?.statusCode === 200) {
                // Set useState Array
                setListUnitUsaha(response.result);
            }
        });

        const timer = setTimeout(() => {
            const script = document.createElement("script");
            script.src = "js/custom.js";
            script.async = true;
            document.body.appendChild(script);
        }, 5000);
        return () => {
            // window.removeEventListener("keypress", handleKeyPress);
            clearTimeout(timer);
        }
    }, []);

    
    
    let column:any;

    column = [
        {
            accessorKey: 'id',
            header: 'id',
            size: 40,
            enableHiding: false,  // disable column agar tidak tampil di tabel
          },
          {
              accessorKey: 'action',
              header: 'Action',
              size:60,
              enableResizing:false,
              enableSorting: false,
              enableColumnActions: false,
              enableColumnOrdering: false,
              Cell: ({cell}) => (
                  <div className="btn-group">
                     <Button variant="success"
                          style = {{height:'30px'}}
                          onClick={() => {handleShow(cell.row.original.id, cell.row.original.nomor); }}
                      >
                          <i className="fa fa-info" aria-hidden="true"></i>
                      </Button>
                  </div>
              )
          },
          {
            accessorKey: 'nomor', 
            header: 'Nomor',
            size: 200,
            enableColumnOrdering: true    // enable move column
            ,enableColumnDragging: true
          },
          {
            accessorKey: 'perihal',
            header: 'Perihal',
            size:500,
            enableColumnOrdering: true,
            enableColumnDragging: true,
            Cell: ({cell})=>(  // contoh input-an di dalam cell
            //   <div>
                <span style = {{whiteSpace:'normal'}}>{cell.row.original.perihal}</span>
                //   {<input type = "text" className="form-control form-control-sm" onChange={(e)=>{getdataChange(e, cell)}} /> }
            //   </div>
            )
          },
          {
            accessorKey: 'ditujukan',
            header: 'Ditujukan',
            size:300,
            Cell: ({cell}) => (
          
                <span style = {{whiteSpace:'normal'}}>{cell.row.original.flowType}</span>
            )
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
              accessorKey: 'status',
              // accessorFn for sorting and filtering
              // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
              id: 'status',
              header: 'Status',
              Cell: ({ cell }) => (
                      <span style = {{whiteSpace:'normal'}}>
                          {cell.row.original.pic}
                          {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                      </span>
              )
          },
          {
            accessorKey: 'statusTimeStr',
            // accessorFn for sorting and filtering
            // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
            id: 'statusTimeStr',
            header: 'Status Time',
            Cell: ({ cell }) => (
                    <span style = {{whiteSpace:'normal'}}>
                        {cell.row.original.statusTimeStr}
                        {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                    </span>
            )
        },
        {
            accessorKey: 'lastReceivedByName',
            // accessorFn for sorting and filtering
            // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
            id: 'lastReceivedByName',
            header: 'Last Recv.By',
            Cell: ({ cell }) => (
                    <span style = {{whiteSpace:'normal'}}>
                        {cell.row.original.lastReceivedByName}
                        {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                    </span>
            )
        },
        {
            accessorKey: 'lastReceivedTimeStr',
            // accessorFn for sorting and filtering
            // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
            id: 'lastReceivedTimeStr',
            header: 'Last Recv.Time',
            Cell: ({ cell }) => (
                    <span style = {{whiteSpace:'normal'}}>
                        {cell.row.original.lastReceivedTimeStr}
                        {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                    </span>
            )
        },
        {
            accessorKey: 'lastNotes',
            // accessorFn for sorting and filtering
            // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
            id: 'lastNotes',
            header: 'Catatan',
            Cell: ({ cell }) => (
                    <span style = {{whiteSpace:'normal'}}>
                        {cell.row.original.lastNotes}
                        {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                    </span>
            )
        },
        {
            accessorKey: 'isRejected',
            // accessorFn for sorting and filtering
            // accessorFn: (originalRow) => new Date(new Date(originalRow?.['requestTime']).setHours(0,0,0)),
            id: 'isRejected',
            header: 'Ditolak',
            Cell: ({ cell }) => (
                    <span style = {{whiteSpace:'normal'}}>
                        {cell.row.original.isRejected ? 'true' : 'false'}
                        {/* {formatDate(new Date(cell.getValue<string>()),"yyyy/mm/dd")} */}
                    </span>
            )
        }
    ]

    
    // Using React component
    // type SelectProps = React.ComponentProps<typeof Select>;
    // const UnitUsahaSelect = ({
    //     onChange,
    //     defaultValue
    // }: Pick<SelectProps, "onChange" | "defaultValue">) => {
    //     return <Select
    //         className="basic-single react-select"
    //         classNamePrefix="select"
    //         tabSelectsValue={false}
    //         isDisabled={false}
    //         isClearable={false}
    //         isSearchable={false}
    //         menuPortalTarget={document.body}
    //         maxMenuHeight={200}
    //         options={listUnitUsaha}
    //         {...{ onChange, defaultValue }} />;
    // };

    const handleFinalFormSubmit = (values: any) => {
        const { ...dataInput } = values;
        // console.log(unitUsahaAccordion)
        console.log(valUnitUsaha)
        console.log(keywordAccordion)
        console.log(startDate)
        console.log(endDate)

        
        let arr_temp_pt:any[] = [];
        if (!Array.isArray(valUnitUsaha))
        {
            arr_temp_pt = [
                ...arr_temp_pt,
                valUnitUsaha
            ];
            arr_temp_pt = arr_temp_pt.map((obj, idx)=>{
                return obj?.['label']
            })
        }
        else{
            arr_temp_pt = [...valUnitUsaha];

            arr_temp_pt = arr_temp_pt.map((obj, idx)=>{
                return obj?.['label']
            })
        }
        
        setAlertTanggal(false);
        setNoResult(false);
        setLoading(true);
        setLoader(true);

        if (valUnitUsaha == null){
            swal("Mohon pilih Unit Usaha", "", "warning");
            setNoResult(false);
            setLoading(false);
            setLoader(false);
            return
        }
        if (valUnitUsaha.length == 0){
            swal("Mohon pilih Unit Usaha", "", "warning");
            setNoResult(false);
            setLoading(false);
            setLoader(false);
            return
        }

        if (startDate > endDate)
        {
            setAlertTanggal(true);
            setTimeout(()=>{
                setAlertTanggal(false);
            },3000)

            setLoading(false);
            setLoader(false);
            return
        }

        // PIIS
        try {
            let newDataInput = {
                // unitusaha: unitUsahaAccordion.label,
                unitusaha: [...arr_temp_pt],
                keyword: keywordAccordion
                // keyword: !keywordAccordion ? 'aaa' : keywordAccordion.replace(/\//gi, '%2f')
                // unitusaha: dataInput.unitusaha.label,
                // keyword: dataInput.keyword === undefined ? "aaa" : dataInput.keyword
            };
            
            const unitUsaha = newDataInput.unitusaha;
            const keyword = newDataInput.keyword;
            const startdate = moment(startDate).format("YYYYMMDD");
            const enddate = moment(endDate).format("YYYYMMDD");

            // console.log(id_ms_login);
            // console.log(keyword);
            // console.log(unitUsaha);
            // console.log(startdate);
            // console.log(enddate);

            const list = getDataHistorySPD(id_ms_login, unitUsaha, keyword, startdate, enddate)
                .then(function (response) {
                    
                    if (response?.statusCode === 200) {
                        console.log(response.result);
                        // Set useState Array
                        
                        setListHistorySPD(response.result);
                        setData(response.result);
                        setLoader(false);

                        if (response.result.length > 0){
                            setNoResult(false)
                        }
                        else{
                            setNoResult(true)
                        }

                        setTimeout(()=>{
                            setLoading(false);
                        },500)
                    } else {
                        // setMessage(response.message);
                        // setStatus(response.statusCode);
                        setNoResult(false);
                        setData([])
                        swal("Data Error", "", "warning");
                        setTimeout(()=>{
                            setLoading(false);
                            setLoader(false);
                        },500)
                    }
                });
        } catch (error) {
            swal("Periksa Kembali Filter Kriteria Pencarian", "", "warning");
            setNoResult(false);
            setLoading(false);
            setData([]);
            setLoader(false);
        }
    }

    const handleClose = () => setShow(false);

    function handleShow(id: number, nomor: string) {

        try {
            setNomor(nomor);

            const detail = getDataHistorySPDDetail(id)
                .then(function (response) {
                    if (response?.statusCode === 200) {
                        console.log(response.result);
                        // Set useState Array
                        setModalData(response.result);
                    } else {
                        swal("Data Error", "", "warning");
                    }
                });
        } catch (error) {
            swal("Mohon pilih dokumen", "", "warning");
        }

        setShow(true);
    }

    function formatPrice(value: number) {
        if (value < 0) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            var aa = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            return '(' + aa.replace('-', '') + ')'
        } else {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        }
    }

    const handleClick = () => {
        setLoading(true);
    }


    const handleChangeUnitUsaha = (e) => {
        console.log(e)
        setValUnitUsaha(e)
    }

    const handleChangeAccordion = 
        (panel:string) => (event: React.SyntheticEvent, isExpanded: boolean) =>
    {
        if (isExpanded){
            // jika terbuka maka reload kembali jquery nya
            removeCustomjs('custom.js')
            loadjs('custom.js')

            if (showAllOrChecked == 'all'){

                funcShowCheckedOrAll('checked')    
            }
        }
    }

    const handleUnitUsahaChange = (selectOptions) => {
        setUnitUsahaAccordion(selectOptions)
    }
    const handleKeywordChange = (event) => {
        setKeywordAccordion(event.target.value)
    }


    return (
        <>
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>List SPD</h2>                        
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight firstbox">

                    <div className="row border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="d-flex justify-content-start align-items-center svg-searchengin list-title-parent"
                                    style = {{columnGap:'14px'}}>
                                { svgCustom('searchengin', 'lightgreen', 50) }
                                <span className="list-title-aftericon">Kriteria Pencarian</span>
                            </div>

                            {alertTanggal && 
                                (
                                    <Alert variant="outlined" severity="error" 
                                        style = {{color:'red'}}>
                                        Tanggal awal melebihi tanggal akhir.
                                    </Alert>
                                )
                            }

                            <Form
                                    onSubmit={handleFinalFormSubmit}
                                    // validate={(values: { username: any; password: any; }) => {
                                    //     const errors: any = {};
                                    //     if (!values.username) {
                                    //         errors.username = "Username is required";
                                    //     }

                                    //     if (!values.password) {
                                    //         errors.password = "Password is required";
                                    //     }
                                    //     return errors;
                                    // }}
                                    render={({ handleSubmit }) => (
                                        <form className="m-t" method="POST" onSubmit={handleSubmit}>
                                            <div className="form-group row" style = {{padding:'10px'}}>
                                                <div className="col-md-6">
                                                    <div className="multiselect-parent">
                                                        <div className="multiselect-list">
                                                            <Field name="unitusaha">
                                                                {({ input }) => {
                                                                    return (
                                                                        <React.Fragment>

                                                                            {/* <h3>Unit Usaha</h3> */}
                                                                            <div className="d-flex justify-content-start align-items-center mb-1">
                                                                                <span className="fa fa-building" style={{fontSize:'17px'}}></span>
                                                                                <span style={{fontSize:'15px', marginLeft:'8px', fontWeight:'bold', opacity:0.8}}>Unit Usaha</span>
                                                                            </div>

                                                                            {/* className = size-sm */}
                                                                                <MultiSelect 
                                                                                    className="basic-singles multi-select-filter-notaccor"
                                                                                    options={unitUsahaList}
                                                                                    onChange={handleChangeUnitUsaha}
                                                                                    value={valUnitUsaha}
                                                                                    closeOnChangedValue={false}
                                                                                    hasSelectAll={true}
                                                                                    labelledBy="Select"
                                                                                />

                                                                            {/* <Select {...input}
                                                                                // className="basic-single react-select"
                                                                                // classNamePrefix="select"
                                                                                tabSelectsValue={false}
                                                                                isDisabled={false}
                                                                                isClearable={true}
                                                                                isSearchable={true}
                                                                                menuPortalTarget={document.body}
                                                                                maxMenuHeight={200}
                                                                                options={unitUsahaList}
                                                                                onChange={handleUnitUsahaChange}
                                                                                value = {unitUsahaAccordion}
                                                                            /> */}
                                                                        </React.Fragment>
                                                                    );
                                                                }}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <Field name="keyword">
                                                        {({ input }) => {
                                                            return (
                                                                <React.Fragment>
                                                                    {/* <h3>Keyword</h3> */}
                                                                    {/* <h3>Nomor</h3> */}
                                                                    <div className="d-flex justify-content-start align-items-center mb-1">
                                                                        <span>
                                                                            {svgCustom('file-lines','gray', 13)}
                                                                        </span>
                                                                        <span style={{fontSize:'15px', marginLeft:'10px', fontWeight:'bold', opacity:0.8}}>
                                                                            Nomor
                                                                        </span>
                                                                    </div>

                                                                    <input {...input} type="text" 
                                                                        onChange={handleKeywordChange}
                                                                        value = {keywordAccordion}
                                                                        className="form-control" placeholder="Keyword" />
                                                                </React.Fragment>
                                                            );
                                                        }}
                                                    </Field>
                                                </div>
                                                <div className="col-md-6 datepicker-list">
                                                    {/* <h3>Start Date</h3> */}
                                                    <div className="d-flex justify-content-start align-items-center my-2">
                                                        <span className="fa fa-calendar" style={{fontSize:'17px'}}></span>
                                                        <span style={{fontSize:'15px', marginLeft:'8px', fontWeight:'bold', opacity:0.8}}>Start Date</span>
                                                    </div>
                                                    {/* <div className="customDatePicker"> */}
                                                        <DatePicker
                                                            className="customDatePicker"
                                                            dateFormat={"dd-MMM-yyyy"}
                                                            selected={startDate}
                                                            onChange={(date: Date) => setStartDate(date)}
                                                        />
                                                    {/* </div> */}
                                                </div>
                                                <div className="col-md-6 datepicker-list">
                                                    {/* <h3>End Date</h3> */}
                                                    <div className="d-flex justify-content-start align-items-center my-2">
                                                        <span className="fa fa-calendar" style={{fontSize:'17px'}}></span>
                                                        <span style={{fontSize:'15px', marginLeft:'8px', fontWeight:'bold', opacity:0.8}}>End Date</span>
                                                    </div>
                                                    <DatePicker
                                                        className="customDatePicker"
                                                        dateFormat={"dd-MMM-yyyy"}
                                                        selected={endDate}
                                                        onChange={(date: Date) => setEndDate(date)}
                                                    />
                                                </div>
                                            </div>

                                            {loading ? 
                                                <LaddaButton
                                                    className='btn block btn-outline-success full-width custom-ladda-button'
                                                    data-color={S}
                                                    data-style={"zoom-in"}
                                                    loading={loading}
                                                    type="submit"
                                                >
                                                </LaddaButton>
                                                :
                                                // <button type="submit" className="ladda-button btn btn-primary block full-width m-b" data-style="zoom-in" >Search</button>
                                                <button type="submit" 
                                                    className="btn block btn-outline-success custom-ladda-button full-width m-b" data-style="zoom-in" >Search</button>
                                            }


                                            <a href="#">
                                                <small></small>
                                            </a>
                                        </form>
                                    )}
                                />
                        </div>
                    </div>

                    <div className="row border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="d-flex justify-content-start align-items-center svg-searchengin list-title-parent"
                                    style = {{columnGap:'14px'}}>
                                { svgCustom('rectangle-list', 'lightgreen', 50) }
                                <span className="list-title-aftericon">Approval SPD List</span>
                            </div>

                            <div style = {{marginTop:'5px'}}>
                                {
                                    noResult == true && data.length == 0 && 
                                    (
                                        <Alert variant="outlined" severity="error"
                                            className="alert-class"
                                                style = {{color:'red'}}>
                                            Tidak ada data yang ditampilkan :(
                                        </Alert>
                                    )
                                }
                            </div>

                            <div style = {{width:'100%',marginTop:'5px',marginBottom:'50px'}}>
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
                                        enableTopToolbar={false}
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
                                            columnVisibility: { 
                                                        id: false,
                                                        // detail: (id_ms_login != 2 && id_ms_login != 3 && id_ms_login != 4 && id_ms_login != 1587) ? true : false,
                                                        // dirNotes: id_ms_login == 2 || id_ms_login == 3 || id_ms_login == 4 || id_ms_login == 1587 ? true : false,
                                                    },
                                            showGlobalFilter: true,
                                            // pagination:{pageSize:10, pageIndex: 1}, // setting page index dan size di awal
                                            columnOrder:[
                                                // 'mrt-row-numbers',
                                                'action',
                                                'nomor',
                                                'perihal',
                                                'ditujukan',
                                                'requestByName',
                                                'requestTimeStr'
                                            ],
                                            pagination:{
                                                pageIndex:0,
                                                pageSize:10
                                            }
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
                                        muiTablePaperProps={{
                                            sx:{
                                                boxShadow:'none'
                                            }
                                        }}
                                        muiTablePaginationProps={{
                                            rowsPerPageOptions: [5,10,15,20,50, {value: data.length, label: 'All'}],
                                            labelRowsPerPage:'Rows per page:',
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
                                        enableColumnActions={false}
                                        enableRowSelection = {true}
                                        enableGlobalFilterChangeMode={true}
                                        enableColumnFilterChangeMode={true}
                                        enableColumnOrdering={true}
                                        enableRowActions={false}     // kolom 'Actions'
                                        state = {{ showSkeletons: loader}}
                                        positionToolbarAlertBanner="top"
                                        // renderRowActions={({ row, table }) => (
                                        //     <Box>
                                        //         <Button onClick={()=>{alert(row.original.nomor)}}>
                                                    
                                        //         </Button>
                                        //     </Box>

                                            // <MenuItem key="edit" onClick={() => console.info('Edit')}>
                                            // Edit
                                            // </MenuItem>,
                                            // <MenuItem key="delete" onClick={() => console.info('Delete')}>
                                            // Delete
                                            // </MenuItem>,
                                        // )}
                                    />
                            </div>
                        </div>

                    </div>                        

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
                                style = {{overflow:'hidden'}}
                            >
                                <div className="d-flex justify-content-start align-items-center svg-searchengin"
                                        style = {{columnGap:'14px'}}>
                                    { svgCustom('searchengin', 'lightgreen', 50) }
                                    <span className="accordion-title-aftericon">Kriteria Pencarian</span>
                                </div>

                            </AccordionSummary>

                            <AccordionDetails>
                                {alertTanggal && 
                                    (
                                        <Alert variant="outlined" severity="error" 
                                            style = {{color:'red'}}>
                                            Tanggal awal melebihi tanggal akhir.
                                        </Alert>
                                    )
                                }
                                
                            </AccordionDetails>

                        </Accordion> */}

                        {/* <Accordion defaultExpanded={expanded} 
                                    style = {{marginTop:10}}
                                    TransitionProps={{ unmountOnExit: true }}
                                    onChange={handleChangeAccordion('panel2')}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                                style = {{overflow:'hidden'}}
                            >
                                <div className="d-flex justify-content-start align-items-center svg-searchengin"
                                        style = {{columnGap:'14px'}}>
                                    { svgCustom('rectangle-list', 'lightgreen', 50) }
                                    <span className="accordion-title-aftericon">Approval SPD List</span>
                                </div>
                            </AccordionSummary>
                            
                            <AccordionDetails>
                                <table className="table table-striped table-bordered table-hover dataTables" >
                                    <thead>
                                        <tr>
                                            <th className="text-right bg-primary">Action</th>
                                            <th className="bg-primary">Nomor</th>
                                            <th className="bg-primary">Perihal</th>
                                            <th className="bg-primary">Ditujukan</th>
                                            <th className="bg-primary">Request By</th>
                                            <th className="bg-primary">Request Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listHistorySPD.map((list =>
                                            <tr key={list.id} className="gradeX">
                                                <td className="text-right">
                                                    <div className="btn-group">
                                                        <Button variant="success"
                                                            onClick={() => handleShow(list.id, list.nomor)}
                                                        >
                                                            <i className="fa fa-info" aria-hidden="true"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td>{list.nomor}</td>
                                                <td>{list.perihal}</td>
                                                <td>{list.flowType}</td>
                                                <td>{list.requestByName}</td>
                                                <td>{list.requestTimeStr}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {
                                    noResult == true && listHistorySPD.length == 0 && 
                                    (
                                        <Alert variant="outlined" severity="error"
                                            className="alert-class"
                                                style = {{color:'red'}}>
                                            Tidak ada data yang ditampilkan :(
                                        </Alert>
                                    )
                                }
                            </AccordionDetails>

                        </Accordion> */}

                            {/* <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Kriteria Pencarian</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="ibox-content">
                                    
                                </div>
                            </div> */}


                        {/* </div> */}
                    {/* </div> */}
                </div>

                {/* <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="col-lg-12">
                            <div className="ibox ">
                                <div className="ibox-title bg-primary">
                                    <h5>Approval SPD List</h5>
                                    <div className="ibox-tools">
                                        <a className="collapse-link">
                                            <i className="fa fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>

                                <div className="ibox-content">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered table-hover dataTables" >
                                            <thead>
                                                <tr>
                                                    <th className="text-right bg-primary">Action</th>
                                                    <th className="bg-primary">Nomor</th>
                                                    <th className="bg-primary">Perihal</th>
                                                    <th className="bg-primary">Ditujukan</th>
                                                    <th className="bg-primary">Request By</th>
                                                    <th className="bg-primary">Request Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listHistorySPD.map((list =>
                                                    <tr key={list.id} className="gradeX">
                                                        <td className="text-right">
                                                            <div className="btn-group">
                                                                <Button variant="success"
                                                                    onClick={() => handleShow(list.id, list.nomor)}
                                                                >
                                                                    <i className="fa fa-info" aria-hidden="true"></i>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                        <td>{list.nomor}</td>
                                                        <td>{list.perihal}</td>
                                                        <td>{list.flowType}</td>
                                                        <td>{list.requestByName}</td>
                                                        <td>{list.requestTimeStr}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            <Modal
                show={show}
                size="xl"
                fullscreen="xl-down"
                onHide={handleClose}
                keyboard={false}
                scrollable={true}
            >
                <Modal.Header className="bg-primary">
                    <Modal.Title >
                        {/* Detail Unit {modalData?.jenisVRA} */}
                        Detail Status Dokumen {nomor}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="wrapper wrapper-content animated fadeInRight">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="ibox ">
                                    <div className="ibox-title bg-primary">
                                        <h5>Detail SPD</h5>
                                    </div>
                                    <div className="ibox-content">
                                        <div className="table-responsive">
                                            <table className="table table-striped table-bordered table-hover dataTables" >
                                                <thead>
                                                    <tr>
                                                        <th className="bg-primary">Arrow</th>
                                                        <th className="bg-primary">Keterangan</th>
                                                        <th className="bg-primary">Tanggal</th>
                                                        <th className="bg-primary">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {modalData.map((list =>
                                                        <tr key={list.id} className="gradeX">
                                                            {/* {list.level === 0 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 1 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 2 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 3 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 4 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 5 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 6 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 7 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 8 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 9 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>}
                                                            {list.level === 10 && <td className="infont col-md-3 col-sm-4">
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                                <i className="fa fa-arrow-right"></i>
                                                            </td>} */}

                                                            <td> 
                                                                {
                                                                    Array.from({length:list.level+1}).map((_,index)=>(
                                                                        <i key = {index} className="fa fa-arrow-right"></i>
                                                                    ))
                                                                }
                                                            </td>
                                                            <td>{list.keterangan}</td>
                                                            <td>{list.tanggal}</td>
                                                            <td>{list.status}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default {
    routeProps: {
        path: '/finance/list/listdokumenspd',
        exact: true,
        component: ListSPD
    },
    name: 'ListSPD',
}
