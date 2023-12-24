// ** React Imports
import { useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { GetStaticProps } from 'next/types'
import { styled } from '@mui/material/styles'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Remove_job_team_member } from 'src/apiprovider/Job/Job'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

// ** MUI Imports
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import { Ref, forwardRef, ReactElement, useState, useEffect } from 'react'

import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import Fade, { FadeProps } from '@mui/material/Fade'

// ** Third Party Components
import axios from 'axios'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/utils/TableHeader'
import { DialogActions, DialogTitle, Typography } from '@mui/material'

import {
  fetchCompanyMembers,
  addCompanyMembers,
  removeCompanyMembers,
  updateCompanyMembers
} from 'src/apiprovider/accounts/company'

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}

interface StoreType {
  members: Array<{}>
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
}

interface OptionsType {
  id: number
  email: string
  avatar: string
  role?: string
}

type UsersType = {
  id: number
  email: string
  first_name: string
  last_name: string
  last_login: string
  role: string
  profile_pic: string
}

interface CellType {
  row: UsersType
}

// ** renders client column
const userRoleObj: UserRoleType = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  manager: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  executive: { icon: 'tabler:user', color: 'warning' }
}

// ** renders client column
const renderClient = (row: UsersType) => {
    if (row.profile_pic && row.profile_pic?.length) { 
        return <CustomAvatar src={process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}${row.profile_pic}` : `${row.profile_pic}`} sx={{ mr: 2.5, width: 38, height: 38 }} />
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

const SettingTeam = () => {
  // ** State
  //const jobId = localStorage.getItem('jobId');
  const [show, setShow] = useState(false)
  const [store, setStore] = useState<StoreType | null>(null)
  const [listMembers, setListMembers] = useState(null)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [value, setValue] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [role, setRole] = useState('manager')
  const [email, setEmail] = useState('')

  const getUserCompanyId = userData => {
    if (userData.admin_companies && userData.admin_companies.company_name) {
      return userData.admin_companies.id
    } else if (userData.managed_companies.length > 0) {
      return userData.managed_companies[0].id
    } else if (userData.exe_companies.length > 0) {
      return userData.exe_companies[0].id
    } else {
      return null // No company found
    }
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
        const userColor = userRoleObj[row.role]?.color || 'primary'
        const userIcon = userRoleObj[row.role]?.icon
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar skin='light' sx={{ mr: 4, width: 30, height: 30 }} color={userColor as ThemeColor}>
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

  const RowOptions = ({ id }: { id: number }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const handleDelete = () => {
      const companyId = localStorage.getItem('companyId')
      removeCompanyMembers(companyId, id)
        .then(res => {
          updateHandle()
        })
        .catch(err => {
          console.log(err)
        })
    }

    return (
      <>
        <MenuItem
          onClick={() => {
            setIsDeleteModalOpen(true)
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:trash' fontSize={20} />
        </MenuItem>

        <Dialog
          open={isDeleteModalOpen}
          onClick={() => {
            setIsDeleteModalOpen(false)
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent
            sx={{
              pb: theme => `${theme.spacing(4)} !important`,
              px: theme => [`${theme.spacing(4)} !important`],
              pt: theme => [`${theme.spacing(4)} !important`]
            }}
          >
            <DialogTitle
              id='alert-dialog-title'
              sx={{
                fontSize: '1rem',
                gap: '2',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon icon='circum:warning' color='#FFBF00' width={100} height={100} />
              <Box sx={{ mt: 4 }}>Do you want to delete?</Box>
            </DialogTitle>
            <DialogActions
              className='dialog-actions-dense'
              sx={{ display: 'flex', m: 4, alignItems: 'center', justifyContent: 'center' }}
            >
              <Button onClick={handleDelete} color='error' variant='contained'>
                Delete
              </Button>
              <Button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })

  const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[2],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
      transform: 'translate(7px, -5px)'
    }
  }))

  const filteredUsers =
    store?.members?.filter((user: StoreType) => user.first_name.toLowerCase().includes(value.toLowerCase())) || []
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleRoleChange = event => {
    setRole(event.target.value)
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const updateHandle = () => {
    fetchCompanyMembers(getUserCompanyId(userData))
      .then(res => {
        const admins = res.executives
        const mag = res.managers
        const invite = res.invitees
        const outputArray = [res.admin, ...mag, ...admins, ...invite]
        outputArray.concat(res.executives)
        setStore({ members: outputArray })
      })
      .catch(error => {
        console.error(error)
      })
  }

  useEffect(() => {
    updateHandle()
    localStorage.setItem('companyId', getUserCompanyId(userData))
  }, [])

  const handleSubmit = () => {
    addCompanyMembers(getUserCompanyId(userData), {
      email: email,
      role: role
    }).then(res => {
      updateHandle()
      setShow(false)
    })
  }

  const options: OptionsType[] = []

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

      <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth='md'
          scroll='body'
          onClose={() => setShow(false)}
          onBackdropClick={() => setShow(false)}
          sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
          <DialogContent
            sx={{
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <CustomCloseButton onClick={() => setShow(false)}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Box sx={{ mb: 8 }}>
              <Typography variant='h3' sx={{ mb: 3 }}>
                Add User
              </Typography>
            </Box>
            <CustomTextField
              fullWidth
              multiline
              id='textarea-outlined'
              placeholder='Email'
              label='Email*'
              value={email}
              onChange={handleEmailChange}
            />
            <FormControl
              sx={{
                paddingTop: '2rem'
              }}
            >
              <FormLabel id='demo-radio-buttons-group-label'>Role*</FormLabel>
              <RadioGroup
                aria-labelledby='demo-radio-buttons-group-label'
                name='radio-buttons-group'
                onChange={handleRoleChange}
                value={role}
              >
                <FormControlLabel value='manager' control={<Radio />} label='Manager' />
                {/* <FormControlLabel value="executive" control={<Radio />} label="Executive" /> */}
              </RadioGroup>
            </FormControl>
            <Box
              sx={{
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingTop: '2rem'
              }}
            >
              <Button onClick={handleSubmit}> Discard</Button>
              <Button variant='contained' onClick={handleSubmit}>
                {' '}
                Submit
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Card>
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default SettingTeam
