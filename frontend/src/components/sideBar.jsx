import clsx from 'clsx';
import { NavLink } from 'react-router-dom'
import { MdDashboard, MdSettings, MdLogout } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { TbFileInvoice, TbReportMoney } from 'react-icons/tb'
import "../index.css"
const SideBar = () => {
    return (

        <aside className='h-screen shrink-0 flex-col items-center bg-gray-300 w-1/6 flex'>
            {/* <button></button>  this button will open side bar in mobile*/}
            <div className="h-1/8  flex items-center-safe  ">
                <h1 className='text-blue-500 font-extrabold text-3xl'>POS App</h1>
            </div>
            <div className='w-9/12 flex flex-col items-center text-gray-900  rounded-md  gap-3 p-4'>

                <NavLink className={({ isActive }) =>
                    clsx("sidebarTabs", { "tabActive": isActive })} to='/dashboard'><MdDashboard className='btnIcons' /> Dashboard</NavLink>
                <NavLink className={({ isActive }) =>
                    clsx("sidebarTabs", { "tabActive": isActive })} to='/products'><RxDashboard className='btnIcons' />Products</NavLink>
                <NavLink className={({ isActive }) =>
                    clsx("sidebarTabs", { "tabActive": isActive })} to='/invoices'><TbFileInvoice className='btnIcons' />Invoices</NavLink>
                <NavLink className={({ isActive }) =>
                    clsx("sidebarTabs", { "tabActive": isActive })} to='/billing'><TbReportMoney className='btnIcons' />Billings</NavLink>
            </div>
            <div className='mt-auto mb-4 w-9/12 flex flex-col text-gray-900  rounded-md gap-3 p-4'>


                <NavLink className={({ isActive }) =>
                    clsx("sidebarTabs", { "tabActive": isActive })} to='/Settings'><MdSettings className='btnIcons' />Settings</NavLink>


                <NavLink className={({ isActive }) =>
                    clsx("sidebarTabs", { "tabActive": isActive })} to='/Logout'><MdLogout className='btnIcons' />Logout</NavLink></div>

        </aside>
    )
}

export default SideBar
