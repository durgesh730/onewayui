import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import { Icon } from '@iconify/react'
import { Avatar, StepIconProps } from '@mui/material'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { styled } from '@mui/system'
import { useState } from 'react'
import Edit from 'src/views/job/edit/Edit'
import Questions from 'src/views/job/edit/Questions'
import Teams from 'src/views/job/edit/Teams'
import Publish from 'src/views/job/edit/Publish'
import { useRouter } from 'next/router'

const steps = [
  { title: 'Edit', icon: 'ps:iron-any-temp' },
  { title: 'Questions', icon: '' },
  { title: 'Teams', icon: '' },
  { title: 'Invite Candidate', icon: '' }
]

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props

  const icons: { [index: string]: any } = {
    1: 'ci:main-component',
    2: 'pepicons-pop:question',
    3: 'fluent:people-team-32-filled',
    4: 'mingcute:invite-fill'
  }

  return (
    <Avatar sx={{ bgcolor: active ? 'primary.dark' : completed ? 'primary.light' : '', cursor: 'pointer' }}>
      <Icon icon={icons[String(props.icon)]} color='white' fontSize={'1.3rem'} />
    </Avatar>
  )
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 20,
    left: 'calc(-50% + 20px)',
    right: 'calc(50% + 16px)'
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#784af4'
    }
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1
  }
}))

export default function HorizontalLinearAlternativeLabelStepper() {
  const router = useRouter();
  const [active, setActive] = useState(Number(router.query.activeStep) || 0);

  const handleOthersPages = (idex: any) => {
    setActive(idex)
  }

  return (
    <Box sx={{ width: '100%', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Stepper
        activeStep={active}
        alternativeLabel
        connector={<QontoConnector />}
        sx={{ width: { xs: '100%', lg: '80rem' } }}
      >
        {steps.map((label, idx) => (
          <Step key={label.title} onClick={() => handleOthersPages(idx)} >
            <StepLabel StepIconComponent={QontoStepIcon}>
              {label.title}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* content */}
      <Box mt={10} width={'100%'} display={'flex'} alignItems='center' justifyContent='center'>
        {active == 0 && <Edit setActive={setActive} />}
        {active == 1 && <Questions setActive={setActive} />}
        {active == 2 && <Teams setActive={setActive} />}
        {active == 3 && <Publish setActive={setActive} />}
      </Box>
    </Box>
  )
}
