import React, { useState, SyntheticEvent, MouseEvent } from 'react'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import JobDashboard from 'src/views/dashboard/active-dashboard'
import ArchivedDashboard from 'src/views/dashboard/archive-dashboard'
import { Box } from '@mui/material'

export default function Index() {
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Grid container spacing={2} sx={{padding:"0rem 11rem"}} >
      <Grid item xs={12} >
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='nav tabs example' sx={{ justifyContent: 'center' }}>
            <Tab
              value='1'
              label='Active Job'
              onClick={(e: MouseEvent<HTMLElement>) => {
                e.preventDefault()
              }}
            />
            <Tab
              value='2'
              label='Archive Jobs'
              onClick={(e: MouseEvent<HTMLElement>) => {
                e.preventDefault()
              }}
            />
          </TabList>
          <Box sx={{marginTop:"-48px"}} >
            <Grid item xs={12} sm={0} sx={{ textAlign: 'end' }}>
              <Button variant='contained'>Create New Job</Button>
            </Grid>
          </Box>
          <TabPanel value='1'>
            <JobDashboard />
          </TabPanel>
          <TabPanel value='2'>
            <ArchivedDashboard />
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}
