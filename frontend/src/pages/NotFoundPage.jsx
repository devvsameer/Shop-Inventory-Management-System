import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NotFoundPage(){
  const { pathname } = useLocation();
  const navigate = useNavigate();



  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      
      <main className="flex-1 flex items-center justify-center p-6">
        <section className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-7xl font-extrabold text-[#2b7cff]">404</p>
          <h1 className="mt-4 text-2xl font-medium">Page not found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't find{" "}
            <span className="font-mono break-all">{pathname}</span>. The link
            may be wrong, or the page may have moved.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="rounded-full bg-[#2b7cff] px-5 py-2 font-semibold text-white hover:bg-[#1d5fd0]"
            >
              Go to Products
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full border border-[#2b7cff] px-5 py-2 font-semibold text-[#1d5fd0] hover:bg-blue-50"
            >
              Go back
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

