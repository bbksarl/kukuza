/** Contrat du BFF C# ; les URLs et délais sont centralisés dans la façade. */
export const authApiConfig = {
  endpoints: {
    login: '/Auth/login',
    register: '/Auth/register',
    logout: '/Auth/logout',
    me: '/Auth/me',
  },
} as const;

export default authApiConfig;
