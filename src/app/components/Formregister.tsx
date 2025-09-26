"use client";
import { useState,useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Preload from "./Preload";

interface Typeclick {
  isclickregister:boolean;
  setisclickregister:React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Formregister({isclickregister,setisclickregister}:Typeclick) {
    const [inputname,setinputname] = useState<string>("");
    const [inputemail,setinputemail] = useState<string>("");
    const [inputpassword,setinputpassword] = useState<string>("");
    const [isinvaliddata,setisinvaliddata] = useState<boolean>(false);
    const [iswait,setiswait] = useState<boolean>(false);
    const divref = useRef<any>(null);
    const inputemailref = useRef<any>(null);
    const inputpasswordref = useRef<any>(null);
    const inputnameref = useRef<any>(null);
    const checkpositionbtn = useRef<number>(0);
    const abortcontrollerref = useRef<AbortController | null>(null);
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();

    //!check input data

    const hover = (e:any) => {
        inputnameref.current.blur();
        inputemailref.current.blur();
        inputpasswordref.current.blur();
        if (inputemail === "" || inputpassword === "" || inputname === "") {
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
        if (inputemail !== "" && inputpassword !== "" && inputname !== "") {
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

            if (inputname === "") {
                setisinvaliddata(true);
                return;
            }
            else {
                setisinvaliddata(false);
            }

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
            const res = await axios.post(url + "/user/register",{name:inputname,email:inputemail,password:inputpassword},{signal:abortcontrollerref.current.signal,withCredentials:true});
            if (res.status === 201) {
                router.push("/game");
            }
        }
        catch(err) {
            setiswait(false);
            setisinvaliddata(true);
        }
    } 

    //!

    return(
        <>
		<h1 className="text-[20px] font-bold">Register</h1>
      	<div className="bg-[#1b1b1b] mt-[20px] p-[20px] rounded-[8px] w-[400px]">
            <input ref={inputnameref} onChange={(e) => setinputname(e.target.value)} type="text" className="border border-[#ffffffa0] rounded-[4px] p-[0_10px] w-full h-[40px] focus:outline-none" placeholder="Name" />
      	    <input ref={inputemailref} onChange={(e) => setinputemail(e.target.value)} className="mt-[20px] border border-[#ffffffa0] rounded-[4px] p-[0_10px] w-full h-[40px] focus:outline-none" type="text" placeholder="Email" />
      	    <input ref={inputpasswordref} onChange={(e) => setinputpassword(e.target.value)} className="mt-[20px] border border-[#ffffffa0] rounded-[4px] p-[0_10px] w-full h-[40px] focus:outline-none" type="text" placeholder="Password"/>
      	    <div className="flex justify-center">
      	        <p onClick={() => setisclickregister(!isclickregister)} className="text-[12px] mt-[10px] cursor-pointer">or Login</p>
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
	  	</>
    );
}