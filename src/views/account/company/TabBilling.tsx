// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components
import CurrentPlanCard from 'src/views/account/company/billings/CurrentPlanCard';
import { useState, useEffect } from 'react';
import { fetchSubscription } from 'src/apiprovider/accounts/company'


const TabBilling = () => {
  const [subData, setSubData] = useState(null)
  const userData = JSON.parse(localStorage.getItem('userData'));

  const getUserCompanyId = (userData) => {
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


  const updateSubscription = () => {
    fetchSubscription(getUserCompanyId(userData))
    .then((res) => {
      setSubData(res);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
      updateSubscription();
      localStorage.setItem('companyId', getUserCompanyId(userData));
    }, [])
    

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlanCard data={subData} />
      </Grid>
    </Grid>
  )
}

export default TabBilling
