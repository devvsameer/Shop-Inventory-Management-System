import './App.css'
import Body from './components/Body.jsx'
import SideBar from './components/sideBar.jsx'

function App() {
    return (
        <div className="flex h-screen w-full flex-row overflow-hidden">
            <SideBar />
            <Body />
        </div>
    )
}

export default App
