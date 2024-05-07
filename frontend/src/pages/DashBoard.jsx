import { Link } from 'react-router-dom'
import {Portfolio, Chart, Table, Run, Strategy} from './Side/index'

const DashBoard = () => {
  return (
    <div>
      <Link to=".">
      <div className=" bg-red-300 text-white">DashBoard</div>
      </Link>      
      <Link to='chart'>
        <Chart />
      </Link>
      <Link to='table'>
        <Table />
      </Link>
      <Link to='strategy'>
        <Strategy />
      </Link>
      <Link to='run'>
        <Run />
      </Link>
      <Link to='portfolio'>
        <Portfolio />
      </Link>
    </div>
    
  )
}

export default DashBoard