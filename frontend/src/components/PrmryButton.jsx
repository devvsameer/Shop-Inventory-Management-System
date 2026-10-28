const PrmryButton = ({ name,onclick }) => {
  return (
    <div onClick={()=>onclick(true)}  className='flex cursor-pointer justify-center rounded-xl bg-blue-500 p-1 pl-2 pr-2 text-white hover:bg-blue-600'>
      {name}
    </div>
  )
}

export default PrmryButton
