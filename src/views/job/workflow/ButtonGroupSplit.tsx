import React, { useRef, useState, Fragment, useEffect } from 'react'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Icon from 'src/@core/components/icon'
import { Grid } from '@mui/material'
import { changeStage } from 'src/apiprovider/Job/workflow'
import Router from 'next/router'
import { Dispatch, SetStateAction } from 'react';


type Options = string[]

const options: Options = ['Invite', 'Review', 'Shortlist', 'Interview',  'Hired', 'Rejected']
const backendOptions: Options = ['invited', 'review', 'shortlisted', 'live interview', 'hired', 'rejected']

type ButtonGroupSplitProps = {id: string, candidateStage: string, handleUpdateCandidateList: Dispatch<SetStateAction<string>>}

const ButtonGroupSplit: React.FC<ButtonGroupSplitProps> = ({id, candidateStage, handleUpdateCandidateList}) => {
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const i = (backendOptions.indexOf(candidateStage) + 1)
    if (i >= backendOptions.length){
      setSelectedIndex(1);
    } else{
      setSelectedIndex(i);
    }
    
  }, [candidateStage])

  const handleClick = (): void => {
    changeStage(id, backendOptions[selectedIndex])
    .then(async (response) => {
      handleUpdateCandidateList(candidateStage)
    });
    setOpen(false);
  }

  const handleMenuItemClick = (index: number): void => {
    changeStage(id, backendOptions[index])
    .then(async (response) => {
      handleUpdateCandidateList(candidateStage)
    });
    setOpen(false);
    
  }

  const handleToggle = (): void => {
    setOpen((prevOpen: boolean) => !prevOpen)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const handleClickAway = (): void => {
    handleClose()
  }

  return (
    <Fragment>
      <div ref={anchorRef}>
        <ButtonGroup variant='contained' aria-label='split button'>
          <Button
            sx={{
              '@media (max-width: 600px)': {
                fontSize: '0.5rem'
              }
            }}
            onClick={handleClick}
          >
            Move to {options[selectedIndex]}
          </Button>
          <Button
            sx={{ px: '0', fontSize: '0.5rem' }}
            aria-haspopup='menu'
            onClick={handleToggle}
            aria-label='select merge strategy'
            aria-expanded={open ? 'true' : undefined}
            aria-controls={open ? 'split-button-menu' : undefined}
          >
            <Icon icon='tabler:chevron-down' />
          </Button>
        </ButtonGroup>
      </div>
      {open && (
        <Grid>
        <ClickAwayListener onClickAway={handleClickAway}>
          <Grow in={open}>
            <Paper>
              <MenuList
                sx={{
                  position: 'absolute',
                  right: '20px',
                  top: '60px',
                  zIndex: '100',
                  backgroundColor:"white",
                }}
                id='split-button-menu'
              >
                {options.map((option, index) => (
                   index !== 0 && (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={() => handleMenuItemClick(index)}
                      sx={{
                        '&.menu-item': {
                          backgroundColor: index === selectedIndex ? 'primary.main' : 'transparent',
                          color: index === selectedIndex ? 'white' : 'inherit'
                        }
                      }}
                    >
                      {option}
                    </MenuItem>
                   )
                ))}
              </MenuList>
            </Paper>
          </Grow>
        </ClickAwayListener>
        </Grid>
      )}
    </Fragment>
  )
}

export default ButtonGroupSplit
