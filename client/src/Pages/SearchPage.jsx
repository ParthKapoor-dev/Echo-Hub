import { useLocation, useNavigate, Routes, Route } from "react-router-dom";
import UsersearchPage from "../Components/SearchPage-User";
import ArticlesearchPage from "../Components/SearchPage-Article";
import { useEffect, useState } from "react";
import SearchPageBioSection from "../Components/SearchPage-BioSection";
export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [tags, setTags] = useState([]);
    const Navigate = useNavigate();
    const location = useLocation();
    const locationQuery = location.state

    useEffect(() => {
        if (locationQuery) {
            localStorage.setItem('searchQuery', JSON.stringify(locationQuery));
            setSearchQuery(locationQuery)
        } else {
            const query = JSON.parse(localStorage.getItem('searchQuery'));
            setSearchQuery(query || '')
        }

    }, [locationQuery])


    function handleUsers() {
        if (searchQuery) {
            Navigate(`/searchPage/${searchQuery}/user` , {state : searchQuery})
            localStorage.setItem('searchQuery', JSON.stringify(locationQuery));
        }


    }
    function handleArticles() {
        if (searchQuery) {
            Navigate(`/searchPage/${searchQuery}` , {state : searchQuery})
            localStorage.setItem('searchQuery', JSON.stringify(locationQuery));
        }

    }
    return (
        <div className="searchPage-div">
            <div className="searchPage-content-section">
                <h3 className="searchPage-searchDetails">
                    <span>Results for</span> {searchQuery}
                </h3>

                <div className="searchPage-routes">
                    <p className="searchPage-Home-route" onClick={handleArticles}>Articles</p>
                    <p className="searchPage-Lists-route" onClick={handleUsers}>Users</p>
                </div>

                <Routes>
                    <Route path="/" element={<ArticlesearchPage searchQuery={searchQuery} setTags={setTags} />} />
                    {/* <Route path="/article" element={<ArticlesearchPage searchQuery={searchQuery} setTags={setTags} />} /> */}
                    <Route path="/user" element={<UsersearchPage searchQuery={searchQuery} setTags={setTags} />} />

                </Routes>

            </div>

            <SearchPageBioSection tags={tags} />
            {/* {error && <div className="error-div">{error}</div>} */}
        </div>
    )
}
