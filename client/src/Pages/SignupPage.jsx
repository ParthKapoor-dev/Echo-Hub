import { useState , useRef } from "react"
import useUserContext from "../hooks/useUserContext";
import EchoHub from "/images/Echo Hub Image.jpg"
import Animation from "/images/userTwo.gif"
import { CurrentMode } from "../../currentMode";
export default function SignupPage(){
    const [name , setname] = useState('');
    const [email , setEmail ] = useState('');
    const [password , setPassword] = useState('');
    const [error , seterror] = useState(null)
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
            const url = CurrentMode.serverUrl + '/user/signup'
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'content-type':'application/json'
                },
                body : JSON.stringify({name , email , password})
            })
            const json = await response.json();

            if(response.ok){
                console.log(json);
                localStorage.setItem('USER' , JSON.stringify(json));
                dispatch({type:"LOGIN" , payload:json});
                setEmail('');
                setPassword('');
                setname('');
            }else{
                seterror(json.message);
                if(json.message == "Please enter a valid email") setEmail('');
                if(json.message == "Please enter a strong password") setPassword('');
                else { 
                    setEmail('');
                    setPassword('');
                    setname('');
                }
            }
        }

    return(
        <div className="loginPage-div">
            <img src={EchoHub} alt="" />
        <form className="signupPage-loginSection" onSubmit={handleSubmit}>
            <div className="loginPage-Login-title">
                Sign Up
                <img src={Animation} alt="" />
            </div>
            <div className="loginPage-name-div">
                <input type="text" id="Name" required={true} autoComplete="off" value={name} onChange={(e)=>setname(e.target.value)} />
                <label htmlFor="Name">NAME</label>
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

            <button className="loginPage-submit-btn">Sign Up</button>
            {error &&  <div className="loginPage-error-div">{error}</div>}
        </form>
        </div>
    )
}