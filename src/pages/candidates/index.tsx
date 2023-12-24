// ** React Imports
import { useState, useEffect, useCallback, Fragment, forwardRef, ReactElement, Ref } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef, GridToolbarExport } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Fade, FadeProps } from '@mui/material'
import { styled } from '@mui/material/styles'


import * as yup from 'yup'
import { FieldValues, useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateCandidate, listAllCandidates, deleteCandidate } from 'src/apiprovider/candidates/pool'
import { getUserCompany } from 'src/context/selectCompany'

type Options = string[]

interface CandidateType {
  first_name: string
  last_name?: string
  job_deadline: string
  joined_at: string
  profile_pic?: string
  job: string
  stage: string
  id: string
  email: string
  status: string
  total_rating: number
  overall_rating: number
  phone_number: string
  full_name?: string
}

interface CellType {
  row: CandidateType
  handleDelete?: () => void
  getCandiddates?: () => void
}
// ** renders client column


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

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  last_name: yup
    .string()
    .min(3, obj => showErrors('Last name', obj.value.length, obj.min))
    .required(),
  phone_number: yup
    .string()
    .notRequired(),
  first_name: yup
    .string()
    .min(3, obj => showErrors('First name', obj.value.length, obj.min))
    .required()
})


// ** renders client column
const renderClient = (row: CandidateType) => {
  if (row.profile_pic) {
    return <CustomAvatar src={row.profile_pic} sx={{ mr: 2.5, width: 38, height: 38 }} /> // src={process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}${row.profile_pic}` : `${row.profile_pic}`} 
  } else {
    return (
      <CustomAvatar
        skin='light'
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.first_name ? row.first_name : 'John ')}
      </CustomAvatar>
    )
  }
}

const CandidateList = () => {
  // ** State
  const [title, setTitle] = useState<string>('')
  const [stage, setStage] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState({ first_name: '', last_name: '', id: '', job_id: '', email: '', phone_number: '' });

  const handleDeleteModalClose = () => setIsDeleteModalOpen(false)
  const handleUpdateModalClose = () => setIsUpdateModalOpen(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: selectedCandidate.email,
      last_name: selectedCandidate.last_name,
      phone_number: selectedCandidate.phone_number,
      first_name: selectedCandidate.first_name
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (isUpdateModalOpen) {
      reset({
        email: selectedCandidate.email,
        last_name: selectedCandidate.last_name,
        phone_number: selectedCandidate.phone_number,
        first_name: selectedCandidate.first_name
      })
    }
  }, [selectedCandidate, isUpdateModalOpen, reset])

  const onSubmit = (data: FieldValues) => {
    updateCandidate(data, selectedCandidate.id, selectedCandidate.job_id)
    .then(() => {
      getAllCandidates();
      setSelectedCandidate({ first_name: '', last_name: '', id: '', job_id: '', email: '', phone_number: '' });
      setIsUpdateModalOpen(false);
      })
      .catch((e) => {
      console.log(e)
      })

  }

  const getAllCandidates = useCallback(() => {
    const userData = window.localStorage.getItem('userData')
    const parsedUserData = JSON.parse(userData)
    const admin_companies = getUserCompany(parsedUserData).id;
    listAllCandidates(admin_companies)
      .then((response) => {
        setAllCandidates(response)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const handleDeleteCandidate = useCallback((id: string, job_id: string) => {
    deleteCandidate(id, job_id)
      .then((res) => {
        setIsDeleteModalOpen(false)
        getAllCandidates();
        setSelectedCandidate({ first_name: '', last_name: '', id: '', job_id: '', email: '', phone_number: '' });
      })
      .catch((e) => {
        console.log(e)
      })
  }, [getAllCandidates])

  const [allCandidates, setAllCandidates] = useState([])
  useEffect(() => {
    getAllCandidates();
  }, [getAllCandidates, stage])

  const handleJobTitleFilter = useCallback((e: SelectChangeEvent<unknown>) => {
    setTitle(e.target.value as string)
  }, [])

  const [filteredCandidates, setFilteredCandidates] = useState([]);
  useEffect(() => {
    setFilteredCandidates(allCandidates.filter((candidate: CandidateType) => {
      if (stage === '' && title === '') {
        return candidate
      } else if (candidate.stage === stage && candidate.job === title) {
        return candidate
      } else if (candidate.stage === stage && title === '') {
        return candidate
      } else if (candidate.job === title && stage === '') {
        return candidate
      }
    }))
  }, [allCandidates, stage, title])

  const handleStageFilter = useCallback((e: SelectChangeEvent<unknown>) => {
    setStage(e.target.value as string)
  }, [])

  const [displayCandidates, setDisplayCandidates] = useState([])
  useEffect(() => {
    setDisplayCandidates(filteredCandidates.filter((candidate: CandidateType) => {
      if (value === '') {
        return candidate
      } else if (candidate.first_name.toLowerCase().includes(value.toLowerCase())) {
        return candidate
      } else if (candidate.last_name.toLowerCase().includes(value.toLowerCase())) {
        return candidate
      } else if (candidate.email.toLowerCase().includes(value.toLowerCase())) {
        return candidate
      } else if (candidate.job.toLowerCase().includes(value.toLowerCase())) {
        return candidate
      } else if (candidate.stage.toLowerCase().includes(value.toLowerCase())) {
        return candidate
      } else if (candidate.status.toLowerCase().includes(value.toLowerCase())) {
        return candidate
      } else if (candidate.job.toLowerCase().includes(value.toLowerCase())) {
        return candidate
      }
    }))
  }, [filteredCandidates, value])

  useEffect(() => {
    displayCandidates.forEach((candidate: CandidateType) => {
      candidate.full_name = `${candidate.first_name} ${candidate.last_name}`,
        candidate.job_deadline = new Date(candidate.job_deadline).toDateString()
    })
  }, [displayCandidates])


  const uniqueJob = [...new Set(allCandidates.map((candidate) => {
    return candidate.job
  }))]

  const uniqueStage = [...new Set(allCandidates.map((candidate) => {
    return candidate.stage
  }))]

  const handleFilter = (val: string) => {
    setValue(val)
  }


  const columns: GridColDef[] = [
    {
      flex: 0.15,
      minWidth: 280,
      field: 'full_name',
      headerName: 'Candidate',
      renderCell: ({ row }: CellType) => {
        const { first_name, last_name } = row
        const backendOptions: Options = ['invited', 'review', 'shortlisted', 'live interview', 'hired', 'rejected']

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href={`/jobs/${row.job.match(/<([^>]+)>/)?.[1]}/workflow/?stage=${backendOptions.indexOf(row.stage)}&candidate=${row.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {first_name} {last_name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'job',
      minWidth: 170,
      headerName: 'Job Title',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row.job.split('<')[0]}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Email',
      field: 'email',
      renderCell: ({ row }: CellType) => {
        const { email } = row
        return (
          <Typography noWrap >
            {email}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 120,
      headerName: 'Mob no.',
      field: 'phone_number',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.phone_number ? row.phone_number : 'N/A'}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 120,
      headerName: 'Stage',
      field: 'stage',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.stage}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'job_deadline',
      headerName: 'Job Deadline',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.job_deadline}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => {
        const handleDelete = () => {
          setSelectedCandidate({ first_name: row.first_name, last_name: row.last_name, phone_number: row.phone_number, email: row.email, id: row.id, job_id: row.job.split('<')[1].split('>')[0] })
          setIsDeleteModalOpen(true)
        }

        const handleUpdate = () => {
          setSelectedCandidate({ first_name: row.first_name, last_name: row.last_name, phone_number: row.phone_number, email: row.email, id: row.id, job_id: row.job.split('<')[1].split('>')[0] })
          setIsUpdateModalOpen(true)
        }

        return (
          <Box>
            <IconButton onClick={handleUpdate}>
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
            <IconButton>
              <Icon icon='tabler:share' fontSize={20} />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <Icon icon='tabler:trash' fontSize={20} />
            </IconButton>
          </Box>
        )
      }
    },
  ]

  const Toolbar = () => {
    return (
      <Box sx={{ p: theme => theme.spacing(0, 5, 2, 5) }}>
        <Box sx={{ px: 6 }}>
            <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
        </Box>

      </Box>
    );
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Box sx={{ p: theme => theme.spacing(2, 5, 4, 5) }}>
            <Box
              sx={{ pt: 4, px: 6, rowGap: 2, columnGap: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', rowGap: 2, columnGap: 4 }}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Role'
                  sx={{ width: '300px' }}
                  SelectProps={{
                    value: title,
                    displayEmpty: true,
                    onChange: e => handleJobTitleFilter(e)
                  }}
                >
                  <MenuItem value=''>Select Job Title</MenuItem>
                  {
                    uniqueJob.map((job) => {
                      return (
                        <MenuItem key={job} value={`${job}`}>{job.split('<')[0]}</MenuItem>
                      )
                    })
                  }

                </CustomTextField>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Stage'
                  sx={{ width: '300px' }}
                  SelectProps={{
                    value: stage,
                    displayEmpty: true,
                    onChange: e => handleStageFilter(e)
                  }}
                >
                  <MenuItem value=''>Select Stage</MenuItem>
                  {
                    uniqueStage.map((stage) => {
                      return (
                        <MenuItem key={stage} value={stage}>{stage}</MenuItem>
                      )
                    })
                  }

                </CustomTextField>
              </Box>
              <CustomTextField
                value={value}
                placeholder='Search in Candidate'
                onChange={e => handleFilter(e.target.value)}
              />

            </Box>

          </Box>
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={displayCandidates}
            columns={columns}
            disableRowSelectionOnClick
            slots={{ toolbar: Toolbar }}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slotProps={{
              baseButton: {
                size: 'medium',
                variant: 'tonal'
              },
            }}
          />
        </Card>
        <Fragment>
          <Dialog
            open={isDeleteModalOpen}
            onClose={handleDeleteModalClose}
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
                <Box sx={{ mt: 4 }}>Do you want to delete {selectedCandidate.first_name} {selectedCandidate.last_name}?</Box>
              </DialogTitle>
              <DialogActions className='dialog-actions-dense' sx={{ display: 'flex', m: 4, alignItems: 'center', justifyContent: 'center' }}>
                <Button onClick={() => { handleDeleteCandidate(selectedCandidate.id, selectedCandidate.job_id) }} color='error' variant='contained'>Delete</Button>
                <Button onClick={handleDeleteModalClose} >Cancel</Button>
              </DialogActions>
            </DialogContent>
          </Dialog>

          <Dialog
            fullWidth
            open={isUpdateModalOpen}
            maxWidth='sm'
            scroll='body'
            onClose={() => setIsUpdateModalOpen(false)}
            TransitionComponent={Transition}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
          >
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <CustomCloseButton onClick={() => setIsUpdateModalOpen(false)}>
                <Icon icon='tabler:x' fontSize='1.25rem' />
              </CustomCloseButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h3' sx={{ mb: 3 }}>
                  Edit Candidate Information
                </Typography>
              </Box>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <Controller
                        name='first_name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            label='First Name'
                            onChange={onChange}
                            placeholder='Leonard'
                            error={Boolean(errors.first_name)}
                            aria-describedby='validation-schema-first-name'
                            {...(errors.first_name && { helperText: errors.first_name.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name='last_name'
                        control={control}
                        rules={{ required: true }}
                        defaultValue='hello'

                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            value={value}
                            label='Last Name'
                            onChange={onChange}
                            placeholder='Carter'
                            error={Boolean(errors.last_name)}
                            aria-describedby='validation-schema-last-name'
                            {...(errors.last_name && { helperText: errors.last_name.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name='email'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            type='email'
                            value={value}
                            label='Email'
                            onChange={onChange}
                            error={Boolean(errors.email)}
                            placeholder='carterleonard@gmail.com'
                            aria-describedby='validation-schema-email'
                            {...(errors.email && { helperText: errors.email.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name='phone_number'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            type='phone'
                            value={value}
                            label='Mobile no.'
                            onChange={onChange}
                            error={Boolean(errors.phone_number)}
                            placeholder='+91 9876543210'
                            aria-describedby='validation-schema-email'
                            {...(errors.phone_number && { helperText: errors.phone_number.message })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', mt: '6px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                      <Button variant='contained' type='submit'>
                        Submit
                      </Button>
                      <Button variant='tonal' color='secondary' onClick={handleUpdateModalClose}>
                        Discard
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </DialogContent>
          </Dialog>

        </Fragment>
      </Grid>
    </Grid>
  )
}

export default CandidateList
