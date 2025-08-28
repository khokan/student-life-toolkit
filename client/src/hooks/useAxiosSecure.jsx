import axios from 'axios'
import { useEffect } from 'react'

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_NODE_SERVER_URL,
  withCredentials: true,
})

const useAxiosSecure = () => {
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      res => {
        return res
      },
      async error => {
        console.log('Error caught from axios interceptor-->', error.response)
        // if (error.response.status === 401 || error.response.status === 403) {
        //   // logout
        //   logOut()
        //   // navigate to login
        //   navigate('/login')
        // }
        return Promise.reject(error)
      }
    )
  }, [])
  return axiosSecure
}

export default useAxiosSecure
