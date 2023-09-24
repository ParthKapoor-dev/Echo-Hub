import { createContext , useEffect, useReducer } from "react";

export const userContext = createContext();

export function handleReducerHook(prevState , action){
    switch(action.type){
        case "LOGIN":
            console.log("login")
            return {...action.payload}
        case "LOGOUT":
            console.log('logout')
            return { user : null , token: null }
        case "FOLLOWUPDATE":{
            const newUser = { ...prevState , user : {...prevState.user,following : action.payload ,} };
            localStorage.setItem('USER' , JSON.stringify(newUser))
            return newUser;
        }
        case "PROFILEPICUPDATE":{
            const newUser = { ...prevState , user : {...prevState.user,profilePicture : action.payload } };
            localStorage.setItem('USER' , JSON.stringify(newUser))
            return newUser;
        }
        case "ADDTOLIST":{
            const newUser = { ...prevState , user : {...prevState.user, list : [...prevState.user.list , action.payload] } };
            localStorage.setItem('USER' , JSON.stringify(newUser))
            return newUser;
        }
        case "REMOVEFROMLIST":{
            const newList = prevState.user.list.filter(item => item!== action.payload)
            const newUser = { ...prevState , user : {...prevState.user, list : [...newList] } };
            localStorage.setItem('USER' , JSON.stringify(newUser))
            return newUser;
        }
        case "UPDATEPROFILE":{
            const newUser = { ...prevState , user : {...prevState.user , ...action.payload}};
            localStorage.setItem('USER' , JSON.stringify(newUser))
            return newUser;
        }
            
        default : 
            return prevState
    }
}

export function UserContextProvider({children}){
    const [state , dispatch ] = useReducer(handleReducerHook , {
        user : null,
        token : null
    })
    useEffect(()=>{
        const userData =JSON.parse(localStorage.getItem('USER'));
        if(userData){
            dispatch({type : "LOGIN" , payload:userData})
        } 
    },[])
    return(
        <userContext.Provider value={{...state , dispatch}}> 
            {children}
        </userContext.Provider>
        
    )
}