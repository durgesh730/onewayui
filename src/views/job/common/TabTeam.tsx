// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import { useRouter } from 'next/router';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DialogShareProject from 'src/views/job/common/DialogShareProject'
import { Remove_job_team_member, Retrieve_job_team } from 'src/apiprovider/Job/Job'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/utils/TableHeader'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { listAvailableMembers } from 'src/apiprovider/Job/edit'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface StoreType {
  members: Array<{}>;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

type UsersType = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  last_login: string;
  role: string;
  profile_pic: string;
};


interface CellType {
  row: UsersType
}

// ** renders client column
const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' }
}


// ** renders client column
const renderClient = (row: UsersType) => {
  

  if (row.profile_pic && row.profile_pic?.length) {
    return <CustomAvatar src={process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}${row.profile_pic}` : `${row.profile_pic}`}  sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color="primary"
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      > 
        {getInitials(row.first_name ? row.first_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}


const UserList = () => {
  // Get the router object
  const router = useRouter();
  // ** State
  const { job_id } = router.query;
  const [show, setShow] = useState(false);
  const [store, setStore] = useState<StoreType | null>(null);
  const [listMembers, setListMembers] = useState(null)
  const companyId = localStorage.getItem('companyId')
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const RowOptions = ({ id }: { id: number }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = () => {
      const data = [{ member_id: id }]
      Remove_job_team_member(job_id, data)
        .then((res) => {

          Retrieve_job_team(job_id)
            .then((data) => {
              setStore(data)
            })
            .catch((error) => {
              // console.error(error);
            });
            
        })
        .catch((err) => {
          // console.log(err)
        })
    }

    return (
      <>
        <MenuItem
          onClick={() => { setIsDeleteModalOpen(true) }}
          sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
        </MenuItem>


        <Dialog
          open={isDeleteModalOpen}
          onClick={() => { setIsDeleteModalOpen(false) }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(4)} !important`,
              px: theme => [`${theme.spacing(4)} !important`,],
              pt: theme => [`${theme.spacing(4)} !important`,]
            }}
          >

            <DialogTitle id='alert-dialog-title' sx={{
              fontSize: '1rem', gap: '2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon icon='circum:warning' color='#FFBF00' width={100} height={100} />
              <Box sx={{ mt: 4 }}>Do you want to delete?</Box>
            </DialogTitle>
            <DialogActions className='dialog-actions-dense' sx={{ display: 'flex', m: 4, alignItems: 'center', justifyContent: 'center' }}>
              <Button
                onClick={handleDelete}
                color='error' variant='contained'>Delete</Button>
              <Button onClick={() => { setIsDeleteModalOpen(false) }} >Cancel</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    )
  }


  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'fullName',
      headerName: 'User',
      renderCell: ({ row }: CellType) => {
        const { first_name, email, last_name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href='/apps/user/view/account'
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {first_name} {last_name}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'role',
      minWidth: 170,
      headerName: 'Role',
      renderCell: ({ row }: CellType) => {
        const userColor = userRoleObj[row.role]?.color || 'primary';
        const userIcon = userRoleObj[row.role]?.icon;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              skin='light'
              sx={{ mr: 4, width: 30, height: 30 }}
              color={userColor as ThemeColor}
            >
              {userIcon && <Icon icon={userIcon} />}
            </CustomAvatar>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.role}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => {
        if (row.role == 'Admin' || row.id == userData.id){
          return (<Box sx={{ display: 'flex', alignItems: 'center' }}></Box>)
        } else {
          return (<RowOptions id={row.id} />)
        }
      }
    }
  ]

  const filteredUsers = store?.members?.filter((user: StoreType) => user.first_name.toLowerCase().includes(value.toLowerCase())) || [];
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const updateHandle = () => {
    Retrieve_job_team(job_id)
      .then((data) => {
        setStore(data)
        //localStorage.setItem('jobId', job_id);
      })
      .catch((error) => {
        // console.error(error);
      });
  }

  useEffect(() => {
    localStorage.setItem('jobId', job_id);
    updateHandle();
  }, [])

  useEffect(() => {
    listAvailableMembers(job_id)
      .then((res) => {
        setListMembers(res)
      })
      .catch((error) => {
        // console.error(error);
      });
  }, [store])


  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader setShow={setShow} value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={filteredUsers}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 15]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <DialogShareProject setStore={setStore} teams={listMembers} show={show} setShow={setShow} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const apiData = {}

  return {
    props: {
      apiData
    }
  }
}

export default UserList
