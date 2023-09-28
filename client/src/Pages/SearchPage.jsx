import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import UsersearchPage from "../Components/SearchPage-User";
import ArticlesearchPage from "../Components/SearchPage-Article";
import { useEffect, useState } from "react";
export default function searchPage() {
    const [searchQuery, setSearchQuery] = useState();
    const Navigate = useNavigate();
    const location = useLocation();
    const locationQuery = location.state

    useEffect(() => {

        if (locationQuery) {
            localStorage.setItem('searchQuery', JSON.stringify(locationQuery));
            setSearchQuery(locationQuery)
        } else {
            const query = JSON.parse(localStorage.getItem('searchQuery'));
            setSearchQuery(query)
        }

    }, [locationQuery])

    function handleUsers() {
        Navigate(`/searchPage/${searchQuery}/user`)
    }
    function handleArticles() {
        Navigate(`/searchPage/${searchQuery}/article`)
    }
    return (
                <div className="searchPage-div">
                    <div className="searchPage-content-section">
                        <h3 className="searchPage-searchDetails"> 
                         <span>Results For</span> {searchQuery} 
                         </h3>

                        <div className="searchPage-routes">
                            <p className="searchPage-Home-route" onClick={handleArticles}>Articles</p>
                            <p className="searchPage-Lists-route" onClick={handleUsers}>Users</p>
                        </div>

                        <Routes>
                            <Route path="/" element={<ArticlesearchPage searchQuery={searchQuery}/>}/>
                            <Route path="/article" element={<ArticlesearchPage searchQuery={searchQuery}/>}/>
                            <Route path="/user" element={<UsersearchPage searchQuery={searchQuery}/>}/>

                        </Routes>

                    </div>

                    {/* <BioSection /> */}
                    {/* {error && <div className="error-div">{error}</div>} */}
                </div>
    )
}
