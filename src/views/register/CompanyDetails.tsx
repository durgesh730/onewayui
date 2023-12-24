import { Icon } from '@iconify/react'
import { Grid, Typography, Button, InputAdornment, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import { ChangeEvent, useEffect, useState } from 'react'
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'
import { CustomRadioIconsData } from 'src/@core/components/custom-radio/types'
import CustomTextField from 'src/@core/components/mui/text-field'

const data2: CustomRadioIconsData[] = [
  {
    value: '1-1',
    content: <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>1-1</Typography>
  },
  {
    value: '2-10',
    content: <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>2-20</Typography>
  },
  {
    value: '10-50',
    content: <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>10-50</Typography>
  },
  {
    value: '50+',
    content: <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>50+</Typography>
  }
]

const Page = ({
  handlePrev,
  setCompany,
  handleSubmit
}: {
  handlePrev: () => void
  setCompany: any
  handleSubmit: any
}) => {
  const [accountSize, setAccountSize] = useState<string>('1-1')

  const handleAccountSize = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setAccountSize(prop)
    } else {
      setAccountSize((prop.target as HTMLInputElement).value)
    }
  }

  useEffect(() => {
    setCompany((prev: any) => ({ ...prev, account_team_size: accountSize }))
  }, [accountSize])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setCompany((prev: any) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      <Typography variant='h3' sx={{ mt: 10 }}>
        Company Information
      </Typography>
      <Typography variant='body2' sx={{ mb: 5 }}>
        Enter Your Company Information
      </Typography>
      <Grid container spacing={5}>
        {data2.map((item, index) => (
          <CustomRadioIcons
            key={index}
            data={item}
            selected={accountSize}
            name='custom-radios-plan'
            gridProps={{ md: 3, sm: 4, xs: 6 }}
            handleChange={handleAccountSize}
          />
        ))}
      </Grid>
      <Grid container spacing={5} marginTop={2}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            placeholder='Enter Company Name'
            label='Company Name'
            onChange={e => handleChange(e)}
            name='company_name'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            fullWidth
            label='Company Type'
            defaultValue='Private Limited Company / LTD / C-Corp / S-Corp / BV'
            name='business_type'
            onChange={e => handleChange(e)}
          >
            <MenuItem value='Partnership'>Partnership</MenuItem>
            <MenuItem value='Sole Proprietorship'>Sole Proprietorship</MenuItem>
            <MenuItem value='Public Limited Company'> Public Limited Company</MenuItem>
            <MenuItem value='Private Limited Company / LTD / C-Corp / S-Corp / BV'>
              Private Limited Company / LTD / C-Corp / S-Corp / BV
            </MenuItem>
            <MenuItem value='Limited Liability Company / LLC / LLP'>Limited Liability Company / LLC / LLP</MenuItem>
            <MenuItem value='Non-Governmental Organization'>Non-Governmental Organization</MenuItem>
            <MenuItem value='Governmental Organization'>Governmental Organization</MenuItem>
          </CustomTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='Company Website(if any)'
            placeholder='www.xyzcompany.com'
            name='company_website'
            onChange={e => handleChange(e)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            fullWidth
            label='Mobile'
            type='number'
            placeholder='+1 (750) 932-3498'
            name='phone_number'
            onChange={e => handleChange(e)}
            // InputProps={{
            //   startAdornment: <InputAdornment position='start'>In (+91)</InputAdornment>
            // }}
          />
        </Grid>

        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button color='secondary' variant='tonal' onClick={handlePrev} sx={{ '& svg': { mr: 2 } }}>
              <Icon fontSize='1.125rem' icon='tabler:arrow-left' />
              Previous
            </Button>
            <Button color='success' variant='contained' onClick={() => handleSubmit()}>
              Submit
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Page
