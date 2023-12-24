import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useAuth } from 'src/hooks/useAuth'
import { updateUser } from 'src/apiprovider/accounts/user'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))

const TabAccount = () => {
  const { user, setUser, setLoading } = useAuth()

  const initialData = {
    state: '',
    number: '',
    address: '',
    zipCode: '',
    last_name: user?.last_name,
    currency: 'usd',
    first_name: user?.first_name,
    language: user?.language,
    timezone: user?.timezone,
    country: 'australia',
    organization: 'Pixinvent',
    email: 'john.doe@example.com',
    profile_pic: ''
  }

  const [isChanged, setIsChanged] = useState(false)
  const [img, setImg] = useState(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}${user?.profile_pic}` : `${user?.profile_pic}`)
  const [formData, setFormData] = useState(initialData)

  useEffect(() => {
    if (JSON.stringify(formData) == JSON.stringify(initialData)) {
      setIsChanged(false)
    } else setIsChanged(true)
  }, [formData])

  const handleFormChange = (field: string, value: string | File) => {
    if (field == 'profile_pic') {
      setImg(URL.createObjectURL(value as File))
    }
    setFormData(prevFormData => ({
      ...prevFormData,
      [field]: value
    }))
  }

  const handleSubmit = (data: typeof formData) => {

    var acccessToken = localStorage.getItem('accessToken')

    let form_data = new FormData()

    form_data.append('profile_pic', data.profile_pic)
    form_data.append('first_name', data.first_name)
    form_data.append('last_name', data.last_name)
    form_data.append('timezone', data.timezone)
    form_data.append('language', data.language)

    setLoading(true)
    updateUser(form_data)
      .then(res => {
        if (res.success) setUser(res.data)
      })
      .catch(e => console.log(e))
      .finally(() => setLoading(false))
  }

  return (
    <Grid container spacing={6}>
      {/* Account Details Card */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Profile Details' />
          <form>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={img} alt='Profile Pic' />
                <div>
                  <label htmlFor='account-settings-upload-image'>
                    <Button variant='contained' component='span'>
                      Upload New Photo
                    </Button>
                  </label>
                  <input
                    hidden
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFormChange('profile_pic', file)
                      }
                    }}
                    id='account-settings-upload-image'
                  />
                  <Typography sx={{ mt: 4, color: 'text.disabled' }}>Allowed PNG or JPEG. Max size of 800K.</Typography>
                </div>
              </Box>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='First Name'
                    value={formData.first_name}
                    onChange={e => handleFormChange('first_name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Last Name'
                    value={formData.last_name}
                    onChange={e => handleFormChange('last_name', e.target.value)}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Country'
                    select
                    value={formData.country}
                    onChange={e => handleFormChange('country', e.target.value)}
                  >
                    <MenuItem value='australia'>Australia</MenuItem>
                    <MenuItem value='canada'>Canada</MenuItem>
                    <MenuItem value='usa'>USA</MenuItem>
                  </TextField>
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Language'
                    select
                    value={formData.language}
                    onChange={e => handleFormChange('language', e.target.value)}
                  >
                    <MenuItem value='English'>English</MenuItem>
                    <MenuItem value='Arabic'>Arabic</MenuItem>
                    <MenuItem value='Spanish'>Spanish</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label='Timezone'
                    select
                    value={formData.timezone}
                    onChange={e => handleFormChange('timezone', e.target.value)}
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
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardContent>
              <Grid container justifyContent='flex-end'>
                {isChanged && (
                  <>
                    <Button variant='contained' color='primary' onClick={() => handleSubmit(formData)}>
                      Save Changes
                    </Button>
                    <ResetButtonStyled variant='outlined' color='error' onClick={() => setFormData(initialData)}>
                      Reset
                    </ResetButtonStyled>
                  </>
                )}
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid>
    </Grid>
  )
}

export default TabAccount
