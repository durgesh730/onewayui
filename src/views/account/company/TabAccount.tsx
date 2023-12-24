// ** React Imports
import { useState, ElementType, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import Button, { ButtonProps } from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'
import api from 'src/apiprovider/baseApi'
import { useAccess } from 'src/hooks/useAccess'
import { fetchCompanies, updateCompany } from 'src/apiprovider/accounts/company';
import { baseUrl } from 'src/apiprovider/baseApi';

interface Data {
  id: number
  logo: string | null
  account_type: string | null
  account_team_size: string | null
  company_name: string | null
  business_type: string | null
  company_website: string | null
  phone_number: string | null
  created_at: string | null
  category: string | null
  subcategory: string | null
  stripe_id: string | null
  admin: number | null
  billing_address: string | null
  addresses: []
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const TabAccount = () => {
  const auth = useAuth()

  const initialData: Data = {
    id: 0,
    logo: '',
    account_type: '',
    account_team_size: '',
    company_name: '',
    business_type: '',
    company_website: '',
    phone_number: '',
    created_at: '',
    category: null,
    subcategory: null,
    stripe_id: null,
    admin: 0,
    billing_address: null,
    addresses: []
  }

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [userInput, setUserInput] = useState<string>('yes')
  const [initialFormData, setInitialFormData] = useState<Data>(initialData)
  const [formData, setFormData] = useState<Data>(initialFormData)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/15.png')
  const [secondDialogOpen, setSecondDialogOpen] = useState<boolean>(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const userData = JSON.parse(localStorage.getItem('userData'));


  const getUserCompanyName = (userData) => {
    if (userData.admin_companies && userData.admin_companies.company_name) {
      return userData.admin_companies.id;
    } else if (userData.managed_companies.length > 0) {
      return userData.managed_companies[0].id;
    } else if (userData.exe_companies.length > 0) {
      return userData.exe_companies[0].id;
    } else {
      return null; // No company found
    }
  };

  useEffect(() => {
    fetchCompanies(getUserCompanyName(userData))
    .then((response) => {
      setInitialFormData(response)
      setFormData(response)
      setImgSrc(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}${response.logo}` : `${response.logo}`)
    })
    .catch(e => {
      console.error(e)
    })
  }, [])

  // ** Hooks
  const {
    formState: { }
  } = useForm({ defaultValues: { checkbox: false } })

  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => setSecondDialogOpen(false)

  // const onSubmit = () => setOpen(true)

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const newFormData = new FormData();

    if (selectedImageFile) {
      newFormData.append('logo', selectedImageFile);
    }
    newFormData.append('company_name', formData.company_name);
    newFormData.append('company_website', formData.company_website);
    newFormData.append('account_type', formData.account_type);
    newFormData.append('account_team_size', formData.account_team_size);
    newFormData.append('business_type', formData.business_type);
    newFormData.append('phone_number', formData.phone_number);
    newFormData.append('created_at', formData.created_at);
    newFormData.append('category', formData.category);
    newFormData.append('subcategory', formData.subcategory);
    newFormData.append('billing_address', formData.billing_address);

    // Append addresses as an array
    newFormData.append('addresses', JSON.stringify(formData.addresses));

    // Call the updateCompany function with formData
    updateCompany(newFormData, getUserCompanyName(userData))
      .then((response) => {
        // Handle successful response, e.g., show a success message
        window.location.reload()
      })
      .catch((error) => {
        // Handle error, e.g., show an error message
        console.error('Error updating company', error);
      });
  };

  const handleConfirmation = (value: string) => {
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader();
    const { files } = file.target as HTMLInputElement;
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string);
      reader.readAsDataURL(files[0]);

      if (reader.result !== null) {
        setInputValue(reader.result as string);
      }

      setSelectedImageFile(files[0]); // Set the selected image file
    }
  }
  
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc(`${formData.logo}`)
    setSelectedImageFile(null)
  }

  const handleFormChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Profile Details' />
          <form onSubmit={handleSubmit}>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled sx={{ width: "20%" }} src={imgSrc} alt='Profile Pic' />
                <div>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload New Photo
                    <input
                      hidden
                      type='file'
                      value={inputValue}
                      accept='image/png, image/jpeg'
                      onChange={handleInputImageChange}
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='secondary' variant='tonal' onClick={handleInputImageReset}>
                    Reset
                  </ResetButtonStyled>
                  <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                </div>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Company Name'
                    name='company_name'
                    placeholder='Hirelimitless'
                    value={formData?.company_name}
                    onChange={e => handleFormChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Website'
                    name='company_website'
                    placeholder=''
                    value={formData.company_website}
                    onChange={e => handleFormChange(e)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    select
                    label='Company Size'
                    name='account_team_size'
                    type='number'
                    placeholder=''
                    value={formData.account_team_size}
                    onChange={e => handleFormChange(e)}
                  >
                    <MenuItem value='1-1'>1-1</MenuItem>
                    <MenuItem value='2-10'>2-10</MenuItem>
                    <MenuItem value='10-50'>10-50</MenuItem>
                    <MenuItem value='50+'>50+</MenuItem>
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    type='number'
                    label='Phone Number'
                    name='phone_number'
                    value={parseInt(formData.phone_number?.replace(/\D/g, ""), 10)}
                    placeholder='202 555 0111'
                    onChange={e => handleFormChange(e)}
                    // InputProps={{ startAdornment: <InputAdornment position='start'>+</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Company Type'
                    name='account_type'
                    SelectProps={{
                      value: formData.account_type,
                      onChange: e => handleFormChange(e)
                    }}
                  >
                    <MenuItem value='CO'>Corporate</MenuItem>
                    <MenuItem value='AG'>Agency</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Company Category'
                    name='business_type'
                    SelectProps={{
                      value: formData.business_type,
                      onChange: e => handleFormChange(e)
                    }}
                  >
                    <MenuItem value='Partnership'>Partnership</MenuItem>
                    <MenuItem value='Sole Proprietorship'>Sole Proprietorship</MenuItem>
                    <MenuItem value='Public Limited Company'> Public Limited Company</MenuItem>
                    <MenuItem value='Private Limited Company / LTD / C-Corp / S-Corp / BV'>
                      Private Limited Company / LTD / C-Corp / S-Corp / BV
                    </MenuItem>
                    <MenuItem value='Limited Liability Company / LLC / LLP'>
                      Limited Liability Company / LLC / LLP
                    </MenuItem>
                    <MenuItem value='Non-Governmental Organization'>Non-Governmental Organization</MenuItem>
                    <MenuItem value='Governmental Organization'>Governmental Organization</MenuItem>
                  </CustomTextField>
                </Grid>
              </Grid>

              <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
                <Button type='submit' variant='contained' sx={{ mr: 4 }}>
                  Save Changes
                </Button>
                <Button
                  type='reset'
                  variant='tonal'
                  color='secondary'
                  onClick={() => {
                    setFormData({ ...initialFormData })
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>

      {/* Deactivate Account Dialogs */}
      {/* <Dialog fullWidth maxWidth='xs' open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 6, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography>Are you sure you would like to cancel your subscription?</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth maxWidth='xs' open={secondDialogOpen} onClose={handleSecondDialogClose}>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(6)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 8,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 5 }}>
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>
              {userInput === 'yes' ? 'Your subscription cancelled successfully.' : 'Unsubscription Cancelled!!'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog> */}
    </Grid>
  )
}

export default TabAccount
