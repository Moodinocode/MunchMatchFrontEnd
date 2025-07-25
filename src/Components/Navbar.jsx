import { useState,useEffect} from 'react'
import { NavLink, Link } from 'react-router-dom'
import { logout } from '../Services/authService'
import ThemeToggle from './ThemeToggle'
import NotificationDropDown from './NotificationDropDown';
import useNotificationStore from '../store/useNotificationStore'



const Navbar = () => {
  const {notifications, loading,error, fetchNotifications} = useNotificationStore();

  useEffect(()=> {
    fetchNotifications(sessionStorage.getItem("token"))
  },[])

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute("data-theme") === "dark"
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);


  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };
  return (
    <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-5 mt-3 w-52 p-2 shadow">
        <li><NavLink to='/'>Restaurants</NavLink></li>
        <li><NavLink to='/polls'>Polls</NavLink></li>
        {/* <li><a>Polls</a></li> */}
        {/* <li>
          <a>Polls</a>
          <ul className="p-2 menuDropDownZ">
            <li><NavLink to='/polls'>Todays</NavLink></li>
            <li><NavLink to='/mypolls'>My Polls</NavLink></li>
          </ul>
        </li> */}
        
      </ul>
    </div>
    <a className="btn btn-ghost text-xl">MunchMatch</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <li><NavLink to='/'>Restaurants</NavLink></li>
      <li><NavLink to='/polls'>Polls</NavLink></li>
       {/* <li><a>Polls</a></li> */}
      {/* <li>
        <details>
          <summary>Polls</summary>
          <ul className="p-2 w-24 z-1">
            <li><NavLink to='/polls'>Todays</NavLink></li>
            <li><NavLink to='/mypolls'>My Polls</NavLink></li>
          </ul>
        </details>
      </li> */}
     
    </ul>
  </div>
  <div className='w-2/5'></div>
  <div className='flex justify-center items-center'>
    <NotificationDropDown notifications={notifications}/>


<div className="dropdown dropdown-end lg:mr-8">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
  tabIndex={0}
  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
  <li onClick={toggleTheme}>
    {/* Removed <a> and used div to wrap ThemeToggle */}
    <div className="justify-between flex items-center">
      <ThemeToggle isDark={isDark} />
      <span className="badge">New</span>
    </div>
  </li>
  <li><NavLink to='/settings'>Settings</NavLink></li>
  <li>
    <Link
      to='/login'
      onClick={(e) => {
        const token = sessionStorage.getItem("token")
        sessionStorage.clear()
        logout(token).then((response) => {
          console.log(response.data)
        }).catch(error => console.log(error))
      }}
    >
      Logout
    </Link>
  </li>
</ul>
</div>

    </div>
</div>
  )
}

export default Navbar