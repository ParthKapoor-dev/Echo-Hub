import {Route , Routes , Navigate} from "react-router-dom"
import useUserContext from "./hooks/useUserContext";
import "./style.css"

import Navbar from "./Components/navbar";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import UserPage from "./Pages/UserPage";
import PublishPage from "./Pages/PublishPage";
import Accounts from "./Pages/Accounts";
import AccountProfilePage from "./Pages/accountProfile";
import SearchPage from "./Pages/SearchPage";
import ArticlePage from "./Pages/articlePage";
import LandingPage from "./Pages/LandingPage";
export default function App(){
  const { user } = useUserContext();
  return (
    <div className="echoHub-div light">
      <Navbar/>
      <Routes>
        
        <Route path="/" element={user ? <Navigate to='/article/feed' /> : <Navigate to='/user/login'/>}/>
        <Route path="/article/feed" element={user ? <LandingPage/> : <Navigate to='/user/login'/>}/>
        <Route path="/user/login" element={!user ? <LoginPage/> : <Navigate to='/article/feed/'/>}/>
        <Route path="/user/signup" element={!user ? <SignupPage/> : <Navigate to='/article/feed'/>}/>
        <Route path="/profile/*" element={<UserPage/>}/>
        <Route path="/article/write" element={<PublishPage/>}/>
        <Route path="/user/accounts" element={<Accounts/>}/>
        <Route path="/user/account/:id" element={<AccountProfilePage/>}/>
        <Route path="/searchpage/:id/*" element={<SearchPage/>}/>
        <Route path="/article/:id" element={<ArticlePage/>} />
      </Routes>

    </div>
  )
}

