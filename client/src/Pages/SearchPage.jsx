import { useLocation , useNavigate , Routes , Route } from "react-router-dom";
import UserSearchPage from "../Components/userSearchPage";
import ArticleSearchPage from "../Components/articleSearchPage";
import { useEffect , useState } from "react";
export default function SearchPage(){
    const [searchQuery , setSearchQuery] = useState();
    const Navigate = useNavigate();
    const location = useLocation();
    const locationQuery = location.state

    console.log('this is searchquery inside the searchpage');
    console.log(searchQuery);

    useEffect(()=>{
        
        if(locationQuery) {
            localStorage.setItem('searchQuery',JSON.stringify(locationQuery));
            setSearchQuery(locationQuery)
        }else{
            const query = JSON.parse(localStorage.getItem('searchQuery'));
            setSearchQuery(query)
        }
        
    },[locationQuery ])
    
    function handleUsers(){
        Navigate(`/searchpage/${searchQuery}/user`)
    }
    function handleArticles(){
        Navigate(`/searchpage/${searchQuery}/article`)
    }
    return (
        <div className="searchpage-div">
            <button className="searchusers" onClick={handleUsers}>Users</button>
            <button className="searcharticles" onClick={handleArticles}>Articles</button>

            <Routes>
                <Route path="/" element={<UserSearchPage searchQuery={searchQuery}/>} />
                <Route path="/article" element={<ArticleSearchPage searchQuery={searchQuery} />} />
                <Route path="/user" element={<UserSearchPage searchQuery={searchQuery}/>} />
            </Routes>
           
        </div>
    )
}
