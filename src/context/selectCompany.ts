
export const getUserCompany = (userData) => {
    if (userData.admin_companies && userData.admin_companies.company_name) {
      return userData.admin_companies;
    } else if (userData.managed_companies?.length > 0) {
      return userData.managed_companies[0];
    } else if (userData.exe_companies?.length > 0) {
      return userData.exe_companies[0];
    } else {
      return null;
    }
  };