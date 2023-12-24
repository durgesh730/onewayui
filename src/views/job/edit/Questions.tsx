import { Icon } from '@iconify/react'
import {
  Accordion,
  AccordionDetails,
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { Create_job_question, List_question_templates, updateJobQuestion, deleteQuestion } from 'src/apiprovider/Job/Job';
import { retrieveJobQuestions } from 'src/apiprovider/Job/edit';
import Router from "next/router"

const Questions = ({ setActive }: any) => {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false)
  const [template, setTemplate] = useState<any>([])
  const [templateQuestions, setTemplateQuestions] = useState([])
  const [templateSelectAll, setSelectAll] = useState(false)
  const [questionTemplates, setQuestionTemplates] = useState([]);
  const { job_id } = Router.query;
  const companyId = localStorage.getItem('companyId')
  const [questions, setQuestion] = useState([
    {
      title: "",
      description: "",
      takes: 1,
      thinking_time: "00:00:30",
      allowed_time: "00:01:00",
      active: true,
      job: job_id,
      checked: false,
      expanded: true
    }
  ])

  const addQuestion = () => {
    setQuestion((prev: any) => [...prev, {
      title: '',
      description: '',
      takes: 1,
      expanded: true,
      thinking_time: "00:00:30",
      allowed_time: "00:01:00",
      job: job_id,
      active: true
    }])
  }
  
  const removeQuestion = (idx: number) => {
    const updatedQuestions = questions
    const element = updatedQuestions[idx]
    deleteQuestion(element.job, element.id)
      .then((res) => {
        updatedQuestions.splice(idx, 1)
        setQuestion(prev => {
          const updatedQuestions = [...prev]
          updatedQuestions.splice(idx, 1)
          return updatedQuestions
        })
      })
      .catch(() => {
      // console.log('Error removing', idx);
      });
  }

  function toggleExpandedState(idx: number) {
    setQuestion(prev => {
      const updatedQuestions = [...prev]
      updatedQuestions[idx].expanded = !updatedQuestions[idx].expanded
      return updatedQuestions
    })
  }

  const handleNext = () => {
    for (let index = 0; index < questions.length; index++) {
      const element = questions[index];
      if (!element.id) {
        (
          Create_job_question(element)
          .then((res) => {})
          .catch((error) => {
            return error
          })
        )
      } else {
        updateJobQuestion(element.job, element.id, element)
        .then((res) => {})
        .catch((error) => {
          return error
        })
      };
    };
    setActive(2)
  }

  const handleChange = (e: any, idx: number) => {
    const { name, value } = e.target

    var tempQuestions = [...questions]

    tempQuestions[idx] = {
      ...tempQuestions[idx],
      [name]: value
    };

    setQuestion(tempQuestions);
  }

  const handleChangeTemplate = (event: any) => {
    const titleId = event.target.value;
    setTemplate(titleId);
    const title = questionTemplates.find(t => t.id === titleId);
    setTemplateQuestions(title?.questions);
    setTemplateDialogOpen(true);
  }

  useEffect(() => {
    if (templateQuestions?.every(item => item.checked == true)) {
      setSelectAll(true)
    }
    if (templateQuestions?.some(item => item.checked == false)) {
      setSelectAll(false)
    }
  }, [templateQuestions])

  function updateCheckList(idx, checked) {
    setTemplateQuestions(prevList =>
      prevList?.map((item, _idx) => {
        if (_idx === idx) {
          return { ...item, checked }
        }
        return item
      })
    )
  }

  useEffect(() => {
    List_question_templates(companyId)
      .then((data) => {
        setQuestionTemplates(data)
      })
      .catch((error) => {
        // console.error(error);
      });

    retrieveJobQuestions(job_id)
    .then((data) => {
      const modifiedData = data.map((question) => ({
        ...question,
        checked: false,
        expanded: true
      }));
      setQuestion(modifiedData);
    })
    .catch((error) => {
      // console.error(error);
    });

  }, [])

  return (
    <>
      <Box sx={{ width: { xs: '100%', sm: '35rem', md: '50rem' } }}>
        <Typography fontSize={'1.2rem'} mb={4}>
          Interview Questions
        </Typography>

        {/* <Card sx={{ p: 6, mb: 5, border: '1px solid blue', borderColor: 'primary.light' }}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Template</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={template || {}}
              label='Template'
              onChange={handleChangeTemplate}
            >
              <MenuItem value={"None"}>None</MenuItem>
              {questionTemplates?.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Card> */}

        {questions.map((question, idx) => (
          <Accordion
            key={idx}
            sx={{ border: '1px solid blue', borderColor: 'primary.light' }}
            expanded={question.expanded}
            onChange={() => toggleExpandedState(idx)}
          >
            <Box sx={{ display: 'flex', p: 0, m: 0 }}>
              <Box width={'100%'}>
                <Box display={'flex'} justifyContent={'flex-end'} p={3} gap={3} color={'primary.main'}>
                  {question.expanded ? (
                    <Icon
                      icon='lucide:shrink'
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        toggleExpandedState(idx)
                      }}
                    />
                  ) : (
                    <Icon
                      icon='game-icons:expand'
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        toggleExpandedState(idx)
                      }}
                    />
                  )}
                  <Icon
                    icon='material-symbols:close'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      removeQuestion(idx)
                    }}
                  />
                </Box>
                <Divider sx={{ borderColor: 'primary.light' }} />
                <Box p={3}>
                  <Typography fontWeight={'bold !important'}>Question {idx + 1}</Typography>
                </Box>
              </Box>
            </Box>
            <AccordionDetails sx={{ p: 0 }}>
              <Divider sx={{ borderColor: 'primary.light' }} />
              <Box p={6}>
                <TextField fullWidth variant='outlined' label='Title' sx={{ mb: 5 }} name='title' value={question.title} onChange={e => handleChange(e, idx)} />
                <TextField fullWidth variant='outlined' label='Description' name='description' value={question.description} onChange={e => handleChange(e, idx)} />
              </Box>
              <Divider sx={{ borderColor: 'primary.light' }} />
              <Box display={'flex'} p={2} px={4} bgcolor='#F7FAFE'>
                <Typography fontWeight={'bold'}>Answer {idx + 1}</Typography>
              </Box>
              <Divider sx={{ borderColor: 'primary.light' }} />
              <Box p={6}>
                <Grid container spacing={4}>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>Takes</InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        label='Takes'
                        name='takes'
                        value={question.takes}
                        onChange={e => handleChange(e, idx)}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>Thinking time</InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        label='Thinking time'
                        name='thinking_time'
                        value={question.thinking_time}
                        onChange={e => handleChange(e, idx)}
                      >
                        <MenuItem value={"00:00:30"}>30 Seconds</MenuItem>
                        <MenuItem value={"00:01:00"}>1 Minutes</MenuItem>
                        <MenuItem value={"00:02:00"}>2 Minutes</MenuItem>
                        <MenuItem value={"00:03:00"}>3 Minutes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-label'>Allowed Time</InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        label='Allowed Time'
                        name='allowed_time'
                        value={question.allowed_time}
                        onChange={e => handleChange(e, idx)}
                      >
                        <MenuItem value={"00:01:00"}>1 Minutes</MenuItem>
                        <MenuItem value={"00:02:00"}>2 Minutes</MenuItem>
                        <MenuItem value={"00:03:00"}>3 Minutes</MenuItem>
                        <MenuItem value={"00:04:00"}>4 Minutes</MenuItem>
                        <MenuItem value={"00:05:00"}>5 Minutes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        <Card
          sx={{ border: '1px dashed blue', borderColor: 'primary.main', mt: 5, cursor: 'pointer ' }}
          onClick={() => addQuestion()}
        >
          <Typography p={3} width={'100%'} color='primary.main'>
            + Add Question
          </Typography>
        </Card>

        <Button fullWidth variant='contained' onClick={() => { handleNext() }} sx={{ mt: 6 }}>
          Save and Continue
        </Button>
      </Box>

      <Dialog
        open={templateDialogOpen}
        onClose={() => {
          setTemplateDialogOpen(false);
        }}
        fullWidth
        maxWidth='md'
      >
        <Box my={3} mx={5} display={'flex'} alignItems={'center'} gap={2}>
          <Typography fontWeight={'bold'} mr={'auto'}>
            {template.title} Template
          </Typography>
          <FormControlLabel
            label='Select All'
            control={
              <Checkbox
                checked={templateSelectAll}
                indeterminate={
                  templateQuestions?.some((item) => item.checked) && !templateQuestions?.every((item) => item.checked)
                }
                onClick={e => {
                  setTemplateQuestions((prev) => prev?.map((item) => ({ ...item, checked: !templateSelectAll })))
                  setSelectAll(prev => !prev)
                }}
              />
            }
          />
          <Button
            variant='contained'
            color='warning'
            disabled={!templateQuestions?.some(question => question.checked == true)}
            onClick={() => {
              // Get the questions that have the 'checked' field equal to true
              const selectedQuestions = templateQuestions?.filter(question => question.checked).map(q => {
                const { id, active, allowed_time, checked, description, takes, thinking_time, title } = q;
                return {
                  id: id, job: job_id, expanded: false, imported: true, active: active, allowed_time: allowed_time,
                  checked: checked, description: description, takes: takes, thinking_time: thinking_time, title: title
                }
              })
              // Set the questions array to the array of selected questions
              setQuestion(prevQuestions => [...prevQuestions, ...selectedQuestions]);
              // Close the template dialog
              setTemplateDialogOpen(false);
            }}
          >
            Import
          </Button>
        </Box>

        <Box px={5} >
          {templateQuestions?.map((qst: any, idx: any) => {
            return (
              <>
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} py={2}>
                  <Typography>{qst.title}</Typography>
                  <Checkbox checked={qst.checked} onChange={e => updateCheckList(idx, e.target.checked)} />
                </Box>
                <Box p={3}>
                  <Typography variant='body2'>{qst.description}</Typography>
                </Box>
                <Divider />
              </>
            )
          })}
        </Box>
      </Dialog >

    </>
  )
}

export default Questions
