import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className=" h-screen bg-white flex justify-center items-center">
        <div className="text-center">
            <h1>Sorry, the page you were looking for was not found.</h1>
            <Link to='/' className="underline">Return To Home</Link>
        </div>    
    </div>
    
  )
}

export default NotFound