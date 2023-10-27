import { useRef, useState } from "react"
import useUserContext from "../hooks/useUserContext";
import EchoHub from "/images/Echo Hub Image.jpg"
import Animation from "/images/userOne.gif"
export default function LoginPage(){ 
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [error, seterror] = useState(null);
    const {dispatch} = useUserContext();
    const [show , setshow] = useState(false);
    const passwordRef = useRef();
    const emailRef = useRef();

    function handleShow(){
        passwordRef.current.type = !show ? "text" : "password";
        setshow(prev=>!prev);
    }
    function handleEmail(event){
        if(email !== '') emailRef.current.className = "emailClick"
        else emailRef.current.className = "";

        setEmail(event.target.value);
    }
    async function handleSubmit(event){
        event.preventDefault();
        const response = await fetch('https://echo-hub-server.onrender.com/user/login',{
            method:'POST',
            headers:{                    
                'content-type' : 'application/json'
            },
            body:JSON.stringify({email , password})
        })
        const json = await response.json();

        if(response.ok){
            console.log(json)
            localStorage.setItem('USER' , JSON.stringify(json));
            dispatch({type:"LOGIN" , payload:json});
            setEmail('');
            setPassword('')
        }else{
            seterror(json.message);
            if(json.message == "Incorrect Email for login") setEmail('');
            if(json.message == "Incorrect Password") setPassword('');
        }
        }
        
    
    return(
        <div className="loginPage-div">
            <img src={EchoHub} alt="" />
        <form className="loginPage-loginSection" onSubmit={handleSubmit}>
            <div className="loginPage-Login-title">
                Log In
                <img src={Animation} alt="" />
            </div>
            <div className="loginPage-email-div">
                <input type="email" id="Email" required={true} autoComplete="off" value={email} onChange={handleEmail} />
                <label htmlFor="Email" ref={emailRef}>EMAIL</label>
            </div>


            <div className="loginPage-password-div">
                <input type="password" id="Password" required={true} autoComplete="off" value={password} ref={passwordRef} onChange={(e)=>setPassword(e.target.value)} />
                <label htmlFor="Password" >PASSWORD</label>
                <p className="showPassword-p" onClick={handleShow}>{!show ? "🔒" : "😎"}</p>
            </div>

            <h3 className="forgotPassword">Forgot password?</h3>

            <button className="loginPage-submit-btn">Login</button>
            {error &&  <div className="loginPage-error-div">{error}</div>}
        </form>
        </div>
    )
}