import React, { useState, useEffect } from 'react'
import GuestPage from './guestPage'
import PageTwo from './PageTwo'
import PageThree from './PageThree'
import PageFour from './PageFour'
import PageFive from './PageFive'
import PageSix from './PageSix'
import { useRouter } from 'next/router'
import { fetchInterviewStatus } from 'src/apiprovider/interview/candidates'
import ThankYouPage from './thankYouPage'
import PageOne from './PageOne'

const InterviewContent = () => {
  const [activePage, setActivePage] = useState<Number>(0)
  const [apiResult, setApiResult] = useState<JSON>(null)

  const changePage = (page: Number) => {
    setActivePage(page)
  }

  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;

    if (token) {
      fetchInterviewStatus(token)
        .then(result => {
          setApiResult(result);
          if (result.status === "completed") {
            setActivePage(8);
          }
          else if (result.hasOwnProperty('guest')) {
            setActivePage(1);
          }
          else {
            setActivePage(2);
          }
        })
        .catch(error => {
          console.error('API Error:', error);
          // Navigate to the custom 404 page
          router.push('/404');
        });
    }
  }, [router.query.token]);

  return (
    <>
      {activePage === 1 && <GuestPage changePage={changePage} apiResult={apiResult} />}
      {activePage === 2 && <PageOne changePage={changePage} apiResult={apiResult} />}
      {activePage === 3 && <PageTwo changePage={changePage} apiResult={apiResult} />}
      {activePage === 4 && <PageThree changePage={changePage} />}
      {activePage === 5 && <PageFour changePage={changePage} />}
      {activePage === 6 && <PageFive changePage={changePage} />}
      {activePage === 7 && <PageSix changePage={changePage} />}
      {activePage === 8 && <ThankYouPage changePage={changePage} apiResult={apiResult} />}

    </>
  )
}

export default InterviewContent
