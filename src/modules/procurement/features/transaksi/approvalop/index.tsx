import React, { useEffect, useContext, useMemo, useState } from 'react';

import MaterialReactTable, {
  MRT_ColumnDef,
} from 'material-react-table';
import { LoadingButton } from '@mui/lab';
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import swal from "sweetalert";

import { IApprovalOP } from "../../../models/ApprovalOPModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";
import { ProcurementRootStoreContext } from "../../../stores/ProcurementRootStore";

import ResponsiveModal from './ResponsiveModal';

import { formatPrice } from '../../../../../component/format/formatPrice';

const ApprovalOP = () => {
  const modulName = 'procurement';
  const formName = 'Approval OP';

  const procurementRootStore = useContext(ProcurementRootStoreContext);
  const { getDataOP, approvalOP } = procurementRootStore.approvalOPStore;
  const [data, setData] = useState<IApprovalOP[]>([]);
  const [modal, setModal] = React.useState(false);
  const [id, setId] = useState(0);

  const [loader, setLoader] = useState(false);
  const [loadingShow, setLoadingShow] = useState(false);
  const [loadingHide, setLoadingHide] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  // Decrypt Login Data untuk get is_ms_login
  const id_ms_login: Number = getIdLogin();

  // Decrypt menu untuk get user akses
  const user_access: any = getUserAccess(modulName, formName);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {

  }, [id, modal, loader, loadingShow, loadingHide])

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: 'id',
          header: 'id',
          size: 40,
        },
        {
          accessorKey: 'nomor', 
          header: 'Nomor',
        },
        {
          accessorKey: 'tanggal',
          header: 'Tanggal',
        },
        {
          accessorKey: 'supplier',
          header: 'Supplier',
        },
        {
          accessorKey: 'golonganBarang',
          header: 'Golongan Barang',
        },
        {
          accessorKey: 'mataUang',
          header: 'Mata Uang',
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right' }}>
              {cell.getValue<string>()}
            </div>
          ),
        },
        {
          accessorKey: 'grandTotal',
          header: 'Grand Total',
          Cell: ({ cell }) => (
            <div style={{ textAlign: 'right' }}>
             {formatPrice(cell.getValue<number>())}
            </div>
          ),
        },
      ] as MRT_ColumnDef<IApprovalOP>[],
    [],
  );
  
  function loadData() {
    setLoader(true);

    const OPList = getDataOP(id_ms_login).then(function (response) {
      setData(response.result);
      setTimeout(() => {
        setLoader(false);
      }, 1000);  
    })
  }


  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enablePagination={false}
        enableDensityToggle={true}
        initialState={{ density: 'compact', 
          columnVisibility: { id: false },
          showGlobalFilter: true,
        }}
        enableGlobalFilterChangeMode={true}
        muiSearchTextFieldProps={{
          size:'small',
          variant: 'outlined',
          label: 'Search',
          InputLabelProps: { shrink: true },
        }}
        enableColumnFilterChangeMode={true}
        enableColumnOrdering={true}
        state={{ showSkeletons: loader }}
        positionToolbarAlertBanner="top"
        enableSelectAll={false}
        enableRowSelection={true}
        enableRowActions={true}
        renderRowActions={({ row }) => (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem', }}
          >
            <Button color="success" size="small"
              onClick={() => {setModal(true);
              setId(row.original.id);}}
            >
              <i className="fa fa-info" aria-hidden="true"></i>
            </Button>
          </Box>
        )}
        renderTopToolbarCustomActions={({ table }) => {
          const handleActivate = () => {
            if(table.getSelectedRowModel().flatRows.length > 0)
            {
              var messageSuccess = "";
              const array: React.SetStateAction<string[]> = [];

              table.getSelectedRowModel().flatRows.map((row) => {
                messageSuccess +=  '\n' + row.getValue('nomor');
                array.push(row.original.id.toString());
              });

              swal({
                  title: "Approve OP",
                  text: "Apakah Anda Yakin Untuk Menyetujui OP dengan Nomor" + messageSuccess,
                  icon: "warning",
                  buttons: [
                  'Kembali!',
                  'Approve!'
                  ],
                  dangerMode: true,
              })
              .then(function(isConfirm) {
                  if (isConfirm) {
                      let param = {
                        ID_Ms_Login: id_ms_login,
                        ID_Ps_OP: array
                      };

                      const ApproveOP = approvalOP(param).then(function (response) {
                        if (response?.statusCode === 200) {
                          swal("Berhasil Menyetujui OP!", "Nomor :" + messageSuccess, "success")
                              .then((value) => {
                                  table.resetRowSelection();
                                  loadData();
                              });

                          } else if (response?.statusCode === 200 && response?.result != "") {
                              swal("Gagal Menyetujui OP!", response?.result, "error");
                          } else {
                              swal("Gagal Menyetujui!", "", "error");
                          }
                      });
                  }
              })
            }
            else
            {
              swal("Mohon pilih OP yang akan di approve", "", "warning");
            }
          }

          const handleShow = () => {
            setLoader(true); setLoadingShow(true);

            var promise = new Promise(function(resolve, reject) {
              var show = document.getElementsByClassName('MuiTableRow-root MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
              for (var i = 0; i < show.length; i += 1) 
              {
                show[i].style.visibility = 'visible';
              } resolve(true);
            })

            promise.then(bool => setTimeout(function() {
              setLoader(false);setLoadingShow(false);
            }, 1000))
          };

          const handleHide = () => {
            setLoader(true);setLoadingHide(true);
            var promise = new Promise(function(resolve, reject) {
              var hide = document.getElementsByClassName('MuiTableRow-root MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
              var show = document.getElementsByClassName('MuiTableRow-root Mui-selected MuiTableRow-hover') as HTMLCollectionOf<HTMLElement>;
              
              for (var i = 0; i < hide.length; i += 1) 
              {
                hide[i].style.visibility = 'collapse';
              }

              for (var i = 0; i < show.length; i += 1) 
              {
                show[i].style.visibility = 'visible';
              }

              resolve(true);
            })

            promise.then(bool => setTimeout(function() {
              setLoader(false);setLoadingHide(false);
            }, 1000))
            
          };

          return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <LoadingButton
                  color="success"
                  onClick={() => handleActivate()}
                  loading={loadingApprove}
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  startIcon={<CheckCircle />}
                  variant="contained"
                  loadingIndicator="Loading…"
                >
                  Approve
                </LoadingButton>
                <LoadingButton
                  color="info"
                  onClick={() => handleShow()}
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  loading={loadingShow}
                  startIcon={<Visibility />}
                  variant="outlined"
                  loadingIndicator="Loading…"
                >
                  Show All Row
                </LoadingButton>
                <LoadingButton
                  color="info"
                  onClick={() => {
                    handleHide();
                  }}
                  disabled={table.getSelectedRowModel().flatRows.length === 0}
                  loading={loadingHide}
                  startIcon={<VisibilityOff />}
                  variant="outlined"
                  loadingIndicator="Loading…"
                >
                  Show Checked Row Only
                </LoadingButton>
            </div>
          );
        }}
      />
      <div>
        { modal && 
          <ResponsiveModal 
            id={id} 
            show={modal} 
            setModal={setModal}
          >
          </ResponsiveModal> 
        }
     </div> 
    </>
  );
};

export default {
  routeProps: {
      path: '/procurement/transaksi/approvalop',
      exact: true,
      component: ApprovalOP
  },
  name: 'ApprovalOP',
};
