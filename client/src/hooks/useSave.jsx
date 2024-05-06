import { useState } from "react";
import useUserContext from "./useUserContext";

import SavePng from "/images/save.png"
import SaveFilledPng from "/images/saveFilled.png"
import SaveGif from "/images/save.gif"
import { CurrentMode } from "../../currentMode";

export default function useSave(article){
    const { user, token, dispatch } = useUserContext();

    const [save, setSave] = useState(() => {
        if (user?.list.includes(article._id)) return SaveFilledPng;
        return SavePng;
    });

    function handleSaveEnter(){
        setSave(SaveGif)
    }
    function handleSaveLeave(){
        setSave(() => {
            if (user?.list.includes(article._id)) return SaveFilledPng;
            return SavePng;
        })
    }
    async function handleSaveCLick() {
        if (!user.list) return;
        function setUrl() {
            if (user?.list.includes(article._id)) 
                return CurrentMode.serverUrl + '/article/list/remove';
            return CurrentMode.serverUrl + '/article/list/add'
        }
        const url = setUrl();
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user._id,
                articleId: article._id
            })
        });
        const json = await response.json();

        if (response.ok) {
            console.log(json);
            setSave(() => {
                if (user?.list.includes(article._id)) return SaveFilledPng;
                return SavePng;
            })
            if (url === CurrentMode.serverUrl + '/article/list/add')
                dispatch({ type: 'ADDTOLIST', payload: article._id })
            else if (url == CurrentMode.serverUrl + '/article/list/remove')
                dispatch({ type: 'REMOVEFROMLIST', payload: article._id })
            else
                console.log('there is some error here')
        }
    }

    return {
        save , 
        handleSaveEnter,
        handleSaveLeave,
        handleSaveCLick
    }
}