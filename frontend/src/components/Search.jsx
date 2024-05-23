import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

const Search = () => {
  return (
    <div className="border-[2px] border-[rgba(0,0,0,0.1)] rounded-xl flex py-1 items-center">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="grow-[1] opacity-50" />
        <input placeholder="도움말" className="grow-[19] outline-none py-1" />
    </div>
  )
}

export default Search