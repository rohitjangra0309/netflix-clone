
import { BrowserRouter,Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './Components/SignUp'
import Home from './Components/Home'
import FavoritesList from './Components/FavoritesList'
// 'b93990705fmsh23bd2cad97d9216p18a010jsnb20a5538c65a'
function App() {
 
  return (
    <>
    
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/signUp' element={<SignUp></SignUp>}></Route>
        <Route path="/favorites" element={<FavoritesList />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
