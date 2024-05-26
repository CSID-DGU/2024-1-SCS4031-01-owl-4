import { useQuery } from '@tanstack/react-query';
import axios from 'axios'

const Portfolio = () => {
  const token = 'eyJhbGciOiJIUzM4NCJ9.eyJ1c2VySWQiOiIxNTlmNDU0Mi1lYmZmLTRhY2QtYTYwMy1hNGZiNGM5NDUyNmMiLCJpYXQiOjE3MTYzMDAyOTEsImV4cCI6MTcyMTEwMDI5MX0.Vyf48RAXt3Eoxg5iTN3oON_hcYnEHB4octStoJlrE5Y0owYoz7OL0Nv4RlrnNe4q'
  
  const {data} = useQuery({
    queryKey: ['portfolios'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8081/api/v1/portfolios',{
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      console.log(response)
    },
  })
  console.log(data)

  return (
    <div className="w-full bg-slate-200">Portfolio</div>
  )
}

export default Portfolio