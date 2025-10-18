"use client";
import { useState,useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession,signIn,signOut } from "next-auth/react";
import axios from "axios";
import Cookies from "js-cookie";
import Preload from "./Preload";

interface Typeclick {
  isclickregister:boolean;
  setisclickregister:React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Formlogin({isclickregister,setisclickregister}:Typeclick) {
    const [inputemail,setinputemail] = useState<string>("");
    const [inputpassword,setinputpassword] = useState<string>("");
	const [isinvaliddata,setisinvaliddata] = useState<boolean>(false);
    const [iswait,setiswait] = useState<boolean>(true);
    const divref = useRef<any>(null);
    const checkpositionbtn = useRef<number>(0);
    const inputemailref = useRef<any>(null);
    const inputpasswordref = useRef<any>(null);
	const abortcontrollerref = useRef<AbortController | null>(null);
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
	const router = useRouter();
	const { data:session, status } = useSession();

    //!check input data

    const hover = (e:any) => {
        inputemailref.current.blur();
        inputpasswordref.current.blur();
        if (inputemail === "" || inputpassword === "") {
            if (checkpositionbtn.current === 0) {
                e.target.style.transform = "translateX(-130px)";
                checkpositionbtn.current = 1;
            }
            else if (checkpositionbtn.current === 1) {
                e.target.style.transform = "translateX(130px)";
                checkpositionbtn.current = 0;
            }
        }
        else {
            e.target.style.transform = "translateX(0)";
            checkpositionbtn.current = 0;
        }
    }

    useEffect(() => {
        if (inputemail !== "" && inputpassword !== "") {
            divref.current.style.transform = "translateX(0)";
            checkpositionbtn.current = 0;
        }
    },[inputemail,inputpassword]);

    //!

	//!usbmit register and login
	
	const submitForm = async () => {
		try{
			if (abortcontrollerref.current) {
				abortcontrollerref.current.abort();
			}
			abortcontrollerref.current = new AbortController();

			const emailregex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

			if (!emailregex.test(inputemail)) {
				setisinvaliddata(true);
				return;
			}
			else {
				setisinvaliddata(false);
			}

			if (inputpassword.length < 6) {
				setisinvaliddata(true);
				return;
			}
			else {
				setisinvaliddata(false);
			}

			setiswait(true);
			console.log("test1");
			const res = await axios.post(url + "/user/login",{email:inputemail,password:inputpassword},{signal:abortcontrollerref.current.signal,withCredentials:true});
			console.log("test2");
			if (res.status === 201) {
				console.log("test3");
				setinputemail("");
				setinputpassword("");
				window.location.href = "/game";
			}
		}
		catch(err) {
			setiswait(false);
			setisinvaliddata(true);
		}
	} 
	
	//!

	//!check login with google

	useEffect(() => {
		const googlelogin = async () => {
			try{
				const checklogin = localStorage.getItem("checklogin");

				if (checklogin === "true") {
					if (status === "authenticated") {
						setiswait(true);
						const res = await axios.post(url + "/user/googlelogin",{name:session.user?.name,email:session.user?.email},{withCredentials:true});
						if (res.status === 201) {
							localStorage.setItem("checklogin",JSON.stringify(false));
							window.location.href = "/game";
						}
					}
					else if (status === "unauthenticated") {
						setiswait(false);
					}
				}
				else {
					setiswait(false);
				}
			}
			catch(err) {
				setiswait(false);
			}
		}

		googlelogin();
	},[status])

	const logingoogle = async () => {
		try{
			setiswait(true);
			signIn("google",{redirect:false});
			localStorage.setItem("checklogin",JSON.stringify(true));
		}
		catch(err) {}
	}

	//!

    return(
		<>
		<h1 className="text-[20px] font-bold">Login</h1>
      	<div className="bg-[#1b1b1b] mt-[20px] p-[20px] rounded-[8px] w-[400px]">
      	    <input ref={inputemailref} onChange={(e) => setinputemail(e.target.value)} value={inputemail} className="border border-[#ffffffa0] rounded-[4px] p-[0_10px] w-full h-[40px] focus:outline-none" type="text" placeholder="Email" />
      	    <input ref={inputpasswordref} onChange={(e) => setinputpassword(e.target.value)} value={inputpassword} className="mt-[20px] border border-[#ffffffa0] rounded-[4px] p-[0_10px] w-full h-[40px] focus:outline-none" type="text" placeholder="Password"/>
      	    <div className="flex justify-center">
      	        <p onClick={() => setisclickregister(!isclickregister)} className="text-[12px] mt-[10px] cursor-pointer">or Register</p>
      	    </div>
			<p className="text-[12px] mt-[10px] text-[red]">{isinvaliddata ? "invalid data.":""}</p>
			{iswait ? 
				<Preload/>
				:
				<div onClick={() => {submitForm()}} ref={divref} onMouseOver={(e) => {hover(e)}} className="bg-[#ffffff7a] w-[100px] text-center m-[10px_auto] rounded-[4px] p-[5px_20px] cursor-pointer">
      	        	Login
      	    	</div>
			}
      	</div>
		<div onClick={() => logingoogle()} className="mt-[20px] bg-[#fff] text-[#000] p-[5px_10px] rounded-[4px] cursor-pointer flex items-center gap-[5px]">
			<img src="/google.png" className="w-[30px] h-[30px]" alt="" />
			<p>Login with Google</p>
		</div>
	  	</>
    );
}