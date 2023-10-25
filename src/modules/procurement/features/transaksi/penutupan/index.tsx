import React, { useEffect, useContext, useMemo, useState } from 'react';
import MaterialReactTable, {
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { LoadingButton } from '@mui/lab';
import { CheckCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, ListItemIcon, MenuItem, Typography } from '@mui/material';
import swal from "sweetalert";

import { ProcurementRootStoreContext } from "../../../stores/ProcurementRootStore";
import { IDetailPenutupan, IPenutupanList } from "../../../models/PenutupanModel";
import { getIdLogin, getUserAccess } from "../../../../../utils/loginuseraccess";

import ResponsiveModal from './ResponsiveModal';

const PenutupanOP = () => {
  const modulName = 'procurement';
  const formName = 'Approval OP';

  const procurementRootStore = useContext(ProcurementRootStoreContext);
  const { getDataPenutupan, getDataPenutupanDetail, approvalPenutupan } = procurementRootStore.penutupanStore;
  const [data, setData] = useState<IPenutupanList[]>([]);
  const [id, setId] = useState(0);
  const [referensi, setReferensi] = useState(String);

  const [modal, setModal] = React.useState(false);
  const [loader, setLoader] = useState(false);
  const [reload, setReload] = useState(false);
  
  // Decrypt Login Data untuk get is_ms_login
  const id_ms_login: Number = getIdLogin();

  // Decrypt menu untuk get user akses
  const user_access: any = getUserAccess(modulName, formName);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    console.log(id + ' eg eg modal ' + modal)
  }, [id, modal])
  
  useEffect(() => {
    if(reload)
    {
      loadData();
    }
  }, [reload])

  const columns = useMemo(
    () =>
      [
        {
          accessorKey: 'id_ps_penutupan', 
          header: 'id',
        },
        {
          accessorKey: 'jenis', 
          header: 'Flag',
        },
        {
          accessorKey: 'referensi',
          header: 'Referensi',
        },
        {
          accessorKey: 'tanggal',
          header: 'Tanggal',
        },
        {
          accessorKey: 'kodeGolongan',
          header: 'Kode Barang',
        },
        {
          accessorKey: 'namaGolongan',
          header: 'Golongan',
        },
        {
          accessorKey: 'assignee',
          header: 'Assignee',
        },
      ] as MRT_ColumnDef<IPenutupanList>[],
    [],
  );
  
  function loadData() {
    setLoader(true);

    const PenutupanList = getDataPenutupan(id_ms_login);
    PenutupanList.then(function (response) {
        setData(response.result);
        setTimeout(() => {
            setLoader(false);
          }, 1000);
    })
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data}
        enablePagination={true}
        enableDensityToggle={true}
        initialState={{ density: 'compact', 
          columnVisibility: { id_ps_penutupan: false },
          showGlobalFilter: true,
        }}
        enableGlobalFilterChangeMode ={true}
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
        enableRowActions={true}
        renderRowActions={({ row }) => (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem', }}
          >
            <Button color="success" size="small"
              onClick={() => {setModal(true);
              setId(row.original.id);setReferensi(row.getValue('referensi'));}}
            >
              <i className="fa fa-info" aria-hidden="true"></i>
            </Button>
          </Box>
        )}
      />
      <div>
        { modal && 
          <ResponsiveModal 
            id={id} 
            show={modal} 
            referensi={referensi}
            setModal={setModal}
            setReload={setReload}
            >
          </ResponsiveModal> 
        }
     </div> 
    </>
  );
};

export default {
  routeProps: {
      path: '/procurement/transaksi/penutupan',
      exact: true,
      component: PenutupanOP
  },
  name: 'PenutupanOP',
};