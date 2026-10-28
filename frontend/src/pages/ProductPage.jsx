import { useEffect, useState } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
// import DashAlertWindow from '../components/DashAlertWindow'
import ProdMainWindow from '../components/DashMainWindow'
import { getProducts } from '../api/products'
const PAGE_SIZE = 10
const ProductPage = () => {
 

//handling search product
   const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [reload, setReload] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0);
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalProducts: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)



  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchValue.trim())
      setPage(1)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue])


  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)

        const response = await getProducts({
          page,
          limit: PAGE_SIZE,
          search: searchQuery,
        })

        const rows = Array.isArray(response?.rows) ? response.rows : []
        const total = Number(response?.total ?? response?.pagination?.totalProducts ?? rows.length)
        const limit = Number(response?.limit ?? response?.pagination?.limit ?? PAGE_SIZE)
        const currentPage = Number(response?.page ?? response?.pagination?.page ?? page)
        const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / limit))

        if (!isMounted) {
          return
        }

        setProducts(rows)
        setPagination({
          page: currentPage,
          limit,
          totalProducts: total,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        })
      } catch (err) {
        if (!isMounted) {
          return
        }

        setError(err.message || 'Failed to load products data')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }


    loadProducts()

    return () => {
      isMounted = false
    }
  }, [page, reload, searchQuery,refreshKey])
  
  

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage)
    }
  }

  const thresholdProd = products.filter(
    (item) => Number(item.stock) <= Number(item.low_stock_threshold)
  )
  // function refresh(){
  //   setRefreshKey((k) => k + 1);
  // }

  return (
    <div className='flex h-full min-h-0 w-full gap-3 p-3'>
      <div className='flex min-h-0 min-w-0 flex-1 flex-col'>
        <div className='w-full shrink-0 p-1'>
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className='h-9 w-full rounded-2xl border-2 border-gray-300 p-2'
            type='text'
            placeholder='Search by SKU or Name'
          />
        </div>

        {loading ? (
          <div className='p-4'>
            <p className='flex items-center gap-2'>
              <AiOutlineLoading3Quarters className='animate-spin' />
              Loading products...
            </p>
          </div>
        ) : error ? (
          <div className='p-4'>
            <p>Could not load products: {error}</p>
            <button className='reloadBtn mt-2' onClick={() => setReload((value) => value + 1)}>
              <AiOutlineLoading3Quarters />
              Reload
            </button>
          </div>
        ) : (
          <ProdMainWindow products={products} pagination={pagination} onPageChange={changePage} onRefresh={()=>{
            setReload((value) => value + 1)
          }} />
        )}
        
      </div>

      {/* <DashAlertWindow data={thresholdProd} /> */}
    </div>
  )

}

export default ProductPage
