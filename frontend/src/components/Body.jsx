import { Route,Navigate ,Routes } from 'react-router-dom'
import MainLayout from './Layout.jsx'
import ProductPage from '../pages/ProductPage.jsx'
import DashboardPage from '../pages/DashboardPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import BillingsPage from '../pages/BillingsPage.jsx'
import InvoicesPage from '../pages/InvoicesPage.jsx'
import ComingSoonPage from '../pages/ComingSoonPage.jsx'

const Body = () => {
  return (
    <div className='min-w-0 flex-1'>
      <Routes>
        <Route element={<MainLayout />}>
         <Route path="/" element={<Navigate to="/products" replace />} />
          <Route index  path='dashboard' element={<ComingSoonPage/>} />
          <Route path='products' element={<ProductPage />} />
          <Route path='billing' element={<ComingSoonPage/>} />
          <Route path='invoices' element={<ComingSoonPage/>} />
          <Route path='*' element={<NotFoundPage/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default Body
