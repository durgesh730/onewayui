import { Typography } from '@mui/material'
import { useRouter } from 'next/router';
import { useEffect } from 'react';




const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, []);
  
  return (
    <Typography fontSize={'2rem'}>
    </Typography>
  )
}

export default Page
