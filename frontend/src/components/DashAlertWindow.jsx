import '../index.css'
import PrmryButton from './PrmryButton'

const DashAlertWindow = ({ data = [] }) => {
  const alerts = Array.isArray(data) ? data : []

  return (
    <div className='flex min-h-0 w-1/5 shrink-0 flex-col gap-1.5 overflow-auto bg-white text-black'>
      <header className='flex flex-col shadow-gray-600 shadow-xs'>
        <h1 className='windowHeading'>Low Stocks Alerts</h1>
      </header>
      <main className='flex flex-col justify-center gap-5 p-4'>
        {alerts.length === 0 ? (
          <p className='font-semibold text-green-500'>All Stocks are Healthy</p>
        ) : (
          <ul className='list-disc gap-1 p-1 text-center font-medium'>
            {alerts.map((item) => {
              const isLowStock = Number(item.stock) < Number(item.low_stock_threshold)

              return isLowStock ? (
                <li key={item.id ?? item.sku} className='text-left text-yellow-700'>
                  {item.name} is only {item.stock} left
                </li>
              ) : (
                <li key={item.id ?? item.sku} className='bg-red-200 text-left text-red-600'>
                  {item.name} is not on 0 stock
                </li>
              )
            })}
          </ul>
        )}

        <PrmryButton name='View Details' />
      </main>
    </div>
  )
}

export default DashAlertWindow
