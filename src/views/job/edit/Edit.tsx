import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Router from "next/router"
import dayjs from 'dayjs'
import { Create_job, Fetch_company, List_timezones } from 'src/apiprovider/Job/Job';
import { retrieveJob, editJob } from 'src/apiprovider/Job/edit';


const Edit = ({ setActive }: any) => {

  const { job_id } = Router.query;

  const [language, setLanguage] = useState('English');
  // const [timezones, setTimezones] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [submissionDate, setSubmissionDate] = useState(dayjs());
  const [companyId, setCompanyId] = useState(0);
  const [errorjob, setErrorjob] = useState(false);
  const [errordes, setErrordes] = useState(false);
  const [errortime, setErrortime] = useState(false);
  // const [jobData, setJobDate] = useState({
  //   title: "jobTitle",
  //   description: "jobDescription",
  //   Timezone: "timezone",
  //   language: "language",
  //   job_expires_at: "2019-08-24T14:15:22Z",
  //   company: 0,
  // });

  const handleChangeTitle = (event: React.ChangeEvent<{ value: unknown }>) => {
    setJobTitle(event.target.value as string);
  };

  const handleChangeDescription = (event: React.ChangeEvent<{ value: unknown }>) => {
    setJobDescription(event.target.value as string);
  };

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const handleChangeTimezone = (event: SelectChangeEvent) => {
    setTimezone(event.target.value as string);
  };

  const handleSubmissionDateChange = (date: Date | null) => {
    if (date) {
      setSubmissionDate(dayjs(date));
    }
  };

  const handleNext = () => {
    // // Prepare the data to be sent in the request body
    // if (jobTitle.trim() === '') {
    //   setErrorjob(true);
    //   return;
    // } else if (jobDescription.trim() === '') {
    //   setErrordes(true);
    //   return;
    // } else if (timezone === '') {
    //   setErrortime(true);
    //   return;
    // }
    const postData = {
      title: jobTitle,
      description: jobDescription,
      Timezone: timezone,
      // Add other form fields here as needed
      language: language,
      job_expires_at: submissionDate.toISOString(),
      company: companyId,
    };

    editJob(postData, job_id)
      .then((response) => {
        const jobID = response.id;
        // Store the job ID in localStorage
        localStorage.setItem('jobId', jobID);
        // You can also store companyId if needed
        localStorage.setItem('companyId', response.company);
        setActive(1);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {

    retrieveJob(job_id)
    .then(result => {
      setJobTitle(result.title);
      setTimezone(result.Timezone);
      setJobDescription(result.description);
      setLanguage(result.language);
      setSubmissionDate(dayjs(result.job_expires_at));
    })
    .catch((error) => {
      console.error(error);
    });

    // List_timezones()
    //   .then((res) => {
    //     setTimezones(res.timezones)
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    Fetch_company()
      .then((res) => {
        setCompanyId(res.admin_companies.id);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  return (
    <Card sx={{ width: { xs: '100%', sm: '35rem', md: '50rem' } }}>
      <Box height={12} bgcolor={'primary.main'}></Box>
      <Box padding={5} py={8}>
        <form>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth
                variant='outlined'
                label='Job Title*'
                error={errorjob}
                value={jobTitle}
                onChange={handleChangeTitle}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth value={jobDescription} error={errordes} variant='outlined' label='Job Description*' multiline rows={2} onChange={handleChangeDescription} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'>Language*</InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={language}
                  label='Language*'
                  onChange={handleChangeLanguage}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Arabic">Arabic</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                // Convert the default value to a Date object and pass it to the DatePicker
                value={submissionDate}
                label="Deadline*"
                disablePast
                sx={{ width: '100%' }}
                onChange={(date) => handleSubmissionDateChange(date)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Timezone*</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={timezone}
                  label="Timezone*"
                  error={errortime}
                  onChange={handleChangeTimezone}
                >
                  <MenuItem key="Etc/GMT+12" value="Etc/GMT+12">(GMT-12:00) International Date Line West</MenuItem>
                  <MenuItem key="Pacific/Midway" value="Pacific/Midway">(GMT-11:00) Midway Island, Samoa</MenuItem>
                  <MenuItem key="Pacific/Honolulu" value="Pacific/Honolulu">(GMT-10:00) Hawaii</MenuItem>
                  <MenuItem key="US/Alaska" value="US/Alaska">(GMT-09:00) Alaska</MenuItem>
                  <MenuItem key="America/Los_Angeles" value="America/Los_Angeles">(GMT-08:00) Pacific Time (US &amp; Canada)</MenuItem>
                  <MenuItem key="America/Tijuana" value="America/Tijuana">(GMT-08:00) Tijuana, Baja California</MenuItem>
                  <MenuItem key="US/Arizona" value="US/Arizona">(GMT-07:00) Arizona</MenuItem>
                  <MenuItem key="America/Chihuahua" value="America/Chihuahua">(GMT-07:00) Chihuahua, La Paz, Mazatlan</MenuItem>
                  <MenuItem key="US/Mountain" value="US/Mountain">(GMT-07:00) Mountain Time (US &amp; Canada)</MenuItem>
                  <MenuItem key="America/Managua" value="America/Managua">(GMT-06:00) Central America</MenuItem>
                  <MenuItem key="US/Central" value="US/Central">(GMT-06:00) Central Time (US &amp; Canada)</MenuItem>
                  <MenuItem key="America/Mexico_City" value="America/Mexico_City">(GMT-06:00) Guadalajara, Mexico City, Monterrey</MenuItem>
                  <MenuItem key="Canada/Saskatchewan" value="Canada/Saskatchewan">(GMT-06:00) Saskatchewan</MenuItem>
                  <MenuItem key="America/Bogota" value="America/Bogota">(GMT-05:00) Bogota, Lima, Quito, Rio Branco</MenuItem>
                  <MenuItem key="US/Eastern" value="US/Eastern">(GMT-05:00) Eastern Time (US &amp; Canada)</MenuItem>
                  <MenuItem key="US/East-Indiana" value="US/East-Indiana">(GMT-05:00) Indiana (East)</MenuItem>
                  <MenuItem key="Canada/Atlantic" value="Canada/Atlantic">(GMT-04:00) Atlantic Time (Canada)</MenuItem>
                  <MenuItem key="America/Caracas" value="America/Caracas">(GMT-04:00) Caracas, La Paz</MenuItem>
                  <MenuItem key="America/Manaus" value="America/Manaus">(GMT-04:00) Manaus</MenuItem>
                  <MenuItem key="America/Santiago" value="America/Santiago">(GMT-04:00) Santiago</MenuItem>
                  <MenuItem key="Canada/Newfoundland" value="Canada/Newfoundland">(GMT-03:30) Newfoundland</MenuItem>
                  <MenuItem key="America/Sao_Paulo" value="America/Sao_Paulo">(GMT-03:00) Brasilia</MenuItem>
                  <MenuItem key="America/Argentina/Buenos_Aires" value="America/Argentina/Buenos_Aires">(GMT-03:00) Buenos Aires, Georgetown</MenuItem>
                  <MenuItem key="America/Godthab" value="America/Godthab">(GMT-03:00) Greenland</MenuItem>
                  <MenuItem key="America/Montevideo" value="America/Montevideo">(GMT-03:00) Montevideo</MenuItem>
                  <MenuItem key="America/Noronha" value="America/Noronha">(GMT-02:00) Mid-Atlantic</MenuItem>
                  <MenuItem key="Atlantic/Cape_Verde" value="Atlantic/Cape_Verde">(GMT-01:00) Cape Verde Is.</MenuItem>
                  <MenuItem key="Atlantic/Azores" value="Atlantic/Azores">(GMT-01:00) Azores</MenuItem>
                  <MenuItem key="Etc/Greenwich" value="Etc/Greenwich">(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London</MenuItem>
                  <MenuItem key="Africa/Casablanca" value="Africa/Casablanca">(GMT+00:00) Casablanca, Monrovia, Reykjavik</MenuItem>
                  <MenuItem key="Europe/Amsterdam" value="Europe/Amsterdam">(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna</MenuItem>
                  <MenuItem key="Europe/Belgrade" value="Europe/Belgrade">(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague</MenuItem>
                  <MenuItem key="Europe/Brussels" value="Europe/Brussels">(GMT+01:00) Brussels, Copenhagen, Madrid, Paris</MenuItem>
                  <MenuItem key="Europe/Sarajevo" value="Europe/Sarajevo">(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb</MenuItem>
                  <MenuItem key="Africa/Lagos" value="Africa/Lagos">(GMT+01:00) West Central Africa</MenuItem>
                  <MenuItem key="Asia/Amman" value="Asia/Amman">(GMT+02:00) Amman</MenuItem>
                  <MenuItem key="Europe/Athens" value="Europe/Athens">(GMT+02:00) Athens, Bucharest, Istanbul</MenuItem>
                  <MenuItem key="Asia/Beirut" value="Asia/Beirut">(GMT+02:00) Beirut</MenuItem>
                  <MenuItem key="Africa/Cairo" value="Africa/Cairo">(GMT+02:00) Cairo</MenuItem>
                  <MenuItem key="Africa/Harare" value="Africa/Harare">(GMT+02:00) Harare, Pretoria</MenuItem>
                  <MenuItem key="Europe/Helsinki" value="Europe/Helsinki">(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius</MenuItem>
                  <MenuItem key="Asia/Jerusalem" value="Asia/Jerusalem">(GMT+02:00) Jerusalem</MenuItem>
                  <MenuItem key="Europe/Minsk" value="Europe/Minsk">(GMT+02:00) Minsk</MenuItem>
                  <MenuItem key="Africa/Windhoek" value="Africa/Windhoek">(GMT+02:00) Windhoek</MenuItem>
                  <MenuItem key="Asia/Kuwait" value="Asia/Kuwait">(GMT+03:00) Kuwait, Riyadh, Baghdad</MenuItem>
                  <MenuItem key="Europe/Moscow" value="Europe/Moscow">(GMT+03:00) Moscow, St. Petersburg, Volgograd</MenuItem>
                  <MenuItem key="Africa/Nairobi" value="Africa/Nairobi">(GMT+03:00) Nairobi</MenuItem>
                  <MenuItem key="Asia/Tbilisi" value="Asia/Tbilisi">(GMT+03:00) Tbilisi</MenuItem>
                  <MenuItem key="Asia/Tehran" value="Asia/Tehran">(GMT+03:30) Tehran</MenuItem>
                  <MenuItem key="Asia/Muscat" value="Asia/Muscat">(GMT+04:00) Abu Dhabi, Muscat</MenuItem>
                  <MenuItem key="Asia/Baku" value="Asia/Baku">(GMT+04:00) Baku</MenuItem>
                  <MenuItem key="Asia/Yerevan" value="Asia/Yerevan">(GMT+04:00) Yerevan</MenuItem>
                  <MenuItem key="Asia/Kabul" value="Asia/Kabul">(GMT+04:30) Kabul</MenuItem>
                  <MenuItem key="Asia/Yekaterinburg" value="Asia/Yekaterinburg">(GMT+05:00) Yekaterinburg</MenuItem>
                  <MenuItem key="Asia/Karachi" value="Asia/Karachi">(GMT+05:00) Islamabad, Karachi, Tashkent</MenuItem>
                  <MenuItem key="Asia/Calcutta" value="Asia/Calcutta">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</MenuItem>
                  <MenuItem key="Asia/Calcutta" value="Asia/Calcutta">(GMT+05:30) Sri Jayawardenapura</MenuItem>
                  <MenuItem key="Asia/Katmandu" value="Asia/Katmandu">(GMT+05:45) Kathmandu</MenuItem>
                  <MenuItem key="Asia/Almaty" value="Asia/Almaty">(GMT+06:00) Almaty, Novosibirsk</MenuItem>
                  <MenuItem key="Asia/Dhaka" value="Asia/Dhaka">(GMT+06:00) Astana, Dhaka</MenuItem>
                  <MenuItem key="Asia/Rangoon" value="Asia/Rangoon">(GMT+06:30) Yangon (Rangoon)</MenuItem>
                  <MenuItem key="Asia/Bangkok" value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</MenuItem>
                  <MenuItem key="Asia/Krasnoyarsk" value="Asia/Krasnoyarsk">(GMT+07:00) Krasnoyarsk</MenuItem>
                  <MenuItem key="Asia/Hong_Kong" value="Asia/Hong_Kong">(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi</MenuItem>
                  <MenuItem key="Asia/Kuala_Lumpur" value="Asia/Kuala_Lumpur">(GMT+08:00) Kuala Lumpur, Singapore</MenuItem>
                  <MenuItem key="Asia/Irkutsk" value="Asia/Irkutsk">(GMT+08:00) Irkutsk, Ulaan Bataar</MenuItem>
                  <MenuItem key="Australia/Perth" value="Australia/Perth">(GMT+08:00) Perth</MenuItem>
                  <MenuItem key="Asia/Taipei" value="Asia/Taipei">(GMT+08:00) Taipei</MenuItem>
                  <MenuItem key="Asia/Tokyo" value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</MenuItem>
                  <MenuItem key="Asia/Seoul" value="Asia/Seoul">(GMT+09:00) Seoul</MenuItem>
                  <MenuItem key="Asia/Yakutsk" value="Asia/Yakutsk">(GMT+09:00) Yakutsk</MenuItem>
                  <MenuItem key="Australia/Adelaide" value="Australia/Adelaide">(GMT+09:30) Adelaide</MenuItem>
                  <MenuItem key="Australia/Darwin" value="Australia/Darwin">(GMT+09:30) Darwin</MenuItem>
                  <MenuItem key="Australia/Brisbane" value="Australia/Brisbane">(GMT+10:00) Brisbane</MenuItem>
                  <MenuItem key="Australia/Canberra" value="Australia/Canberra">(GMT+10:00) Canberra, Melbourne, Sydney</MenuItem>
                  <MenuItem key="Australia/Canberra" value="Australia/Hobart">(GMT+10:00) Hobart</MenuItem>
                  <MenuItem key="Pacific/Guam" value="Pacific/Guam">(GMT+10:00) Guam, Port Moresby</MenuItem>
                  <MenuItem key="Asia/Vladivostok" value="Asia/Vladivostok">(GMT+10:00) Vladivostok</MenuItem>
                  <MenuItem key="Asia/Magadan" value="Asia/Magadan">(GMT+11:00) Magadan, Solomon Is., New Caledonia</MenuItem>
                  <MenuItem key="Pacific/Auckland" value="Pacific/Auckland">(GMT+12:00) Auckland, Wellington</MenuItem>
                  <MenuItem key="Pacific/Fiji" value="Pacific/Fiji">(GMT+12:00) Fiji, Kamchatka, Marshall Is.</MenuItem>
                  <MenuItem key="Pacific/Tongatapu" value="Pacific/Tongatapu">(GMT+13:00) Nuku'alofa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display={'flex'} justifyContent={'end'} alignItems={'center'} width={'100%'}>
                <Button variant='contained' onClick={() => handleNext()}>
                  Next
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Card>
  )
}

export default Edit
