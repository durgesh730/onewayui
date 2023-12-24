import { Button } from '@mui/material'
import React from 'react'
import TabTeam from 'src/views/job/common/TabTeam'
import { Box } from '@mui/system'

const Teams = ({ setActive }: any) => {
  return (
    <Box sx={{ width: { xs: '100%', sm: '35rem', md: '50rem' } }}>
      <TabTeam />
      <Button sx={{ mt: 5 }} variant='contained' fullWidth onClick={() => setActive(3)}>
        Next
      </Button>
    </Box>
  )
}

export default Teams
