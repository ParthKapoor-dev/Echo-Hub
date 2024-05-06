import { useNavigate } from "react-router-dom"
import useUserContext from "../hooks/useUserContext";
import { useRef, useState } from "react";

import EchoHubIcon from "/images/Echo Hub logo.jpg"
import SearchIcon from "/images/search Icon.png"
import WriteIcon from "/images/write icon.png"
import loginGif from "/images/login.gif"
import signupIcon from "/images/signup.png"
import logoutIcon from "/images/logout.png"

export default function Navbar() {
    const Navigate = useNavigate();
    const { dispatch, user } = useUserContext();
    const LinksRef = useRef();

    function handleOpen() {
        if (LinksRef.current.style.display == 'none')
            LinksRef.current.style.display = 'flex'
        else
            LinksRef.current.style.display = 'none'
    }

    const [search, setsearch] = useState('');
    function handleHome() {
        Navigate('/article/feed')
    }
    function handleLogin() {
        Navigate('/user/login')
    }
    function handleSignup() {
        Navigate('/user/signup')
    }
    function handleLogout() {
        Navigate('/user/login');
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('USER')
    }
    function handleUserClick() {
        Navigate('/profile')
    }
    function handlePublishBtn() {
        Navigate('/article/write')
    }
    function handleSearchBar(event) {
        event.preventDefault();
        Navigate(`/searchpage/${search}`, { state: search });
        console.log(search);
        setsearch('');
    }
    return (
        <nav>
            <div className="navbar-homepage" onClick={handleHome}>
                <img src={EchoHubIcon} alt="Echo Hub" />
            </div>

            <form className="navbar-searchbar" onSubmit={handleSearchBar}>
                <img src={SearchIcon} alt="" />
                <input type="text" id="searchbar" placeholder="Search Echo Hub" value={search} onChange={(e) => setsearch(e.target.value)} />
            </form>
            <div className="navbar-userlinks-comp">

                <div className="navbar-publish-div" onClick={handlePublishBtn}>
                    <img src={WriteIcon} alt="" />
                    Write
                </div>

                {!user ? <div className="LoginAndSignup">
                    <div className="navbar-login-div" onClick={handleLogin}>
                        <img src={loginGif} alt="" />
                        Login
                    </div>
                    <div className="navbar-signup-div" onClick={handleSignup}>
                        <img src={signupIcon} alt="" />
                        SignUp
                    </div>
                </div>
                    :
                    <div className="UserInfoAndLogout">
                        <div className="navbar-userinfo" onClick={handleUserClick}>
                            {user && user?.name}
                        </div>
                        <div className="navbar-logout-div" onClick={handleLogout}>
                            <img src={logoutIcon} alt="" />
                            Logout
                        </div>
                    </div>}
            </div>

            <div className="navbar-userlinks-open" onClick={handleOpen}>
                {user ? user.name : ("Welcome")}
            </div>

            <div className="navbar-userlinks-mobile-div" ref={LinksRef} onClick={handleOpen}>
                {user && (
                    <div className="navbar-publish-div" onClick={handlePublishBtn}>
                        <img src={WriteIcon} alt="" />
                        Write
                    </div>
                )}
                {!user ? <div className="LoginAndSignup">
                    <div className="navbar-login-div" onClick={handleLogin}>
                        <img src={loginGif} alt="" />
                        Login
                    </div>
                    <div className="navbar-signup-div" onClick={handleSignup}>
                        <img src={signupIcon} alt="" />
                        SignUp
                    </div>
                </div>
                    :
                    <div className="UserInfoAndLogout">
                        <div className="navbar-userinfo" onClick={handleUserClick}>
                            Profile
                        </div>
                        <div className="navbar-logout-div" onClick={handleLogout}>
                            <img src={logoutIcon} alt="" />
                            Logout
                        </div>
                    </div>}
            </div>

        </nav>
    )
}