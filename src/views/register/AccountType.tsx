import { Icon } from '@iconify/react'
import { Grid, Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import { ChangeEvent, useEffect, useState } from 'react'
import CustomRadioIcons from 'src/@core/components/custom-radio/icons'
import { CustomRadioIconsData } from 'src/@core/components/custom-radio/types'

const Page = ({ handleNext, setCompany }: { handleNext: () => void; setCompany: any }) => {
  const [accountType, setAccountType] = useState<string>('Corporate')
  
  const handleAccountType = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setAccountType(prop)
    } else {
      setAccountType((prop.target as HTMLInputElement).value)
    }
  }
  
  useEffect(() => {
    setCompany((prev: any) => ({ ...prev, account_type: accountType }))
  }, [accountType])

  const data1: CustomRadioIconsData[] = [
    {
      value: 'CO',
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Icon fontSize='1.8rem' icon='tabler:rocket' />
          <Typography variant='h6' sx={{ my: 2 }}>
            Corporate
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }} variant='body2'>
            Hiring For Your Company
          </Typography>
        </Box>
      )
    },
    {
      isSelected: true,
      value: 'AG',
      content: (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Icon fontSize='1.8rem' icon='tabler:star' />
          <Typography variant='h6' sx={{ my: 2 }}>
            Agency
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }} variant='body2'>
            Hiring For Other Companies
          </Typography>
        </Box>
      )
    }
  ]

  return (
    <>
      <Typography variant='h3'>Choose Account Type</Typography>
      <Typography variant='body2' sx={{ mb: 5 }}>
        Tell us about your business
      </Typography>
      <Grid container spacing={5}>
        {data1.map((item, index) => (
          <CustomRadioIcons
            key={index}
            data={item}
            selected={accountType}
            name='custom-radios-plan'
            gridProps={{ sm: 12, xs: 12, md: 6 }}
            handleChange={handleAccountType}
          />
        ))}
      </Grid>
      <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6)} !important` }}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant='contained' onClick={handleNext} sx={{ '& svg': { ml: 2 } }}>
            Next
            <Icon fontSize='1.125rem' icon='tabler:arrow-right' />
          </Button>
        </Box>
      </Grid>
    </>
  )
}

export default Page
