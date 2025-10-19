"use client";
import { useState,useEffect,useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Preload from "../components/Preload";
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL,{withCredentials: true});

interface Typedatauser {
    id:number;
    name:string;
    email:string;
    score:number;
}

export default function Gameroom() {
    const [dataplayer,setdataplayer] = useState<Typedatauser>() ;
    const [wait,setwait] = useState<boolean>(true);
    const [isfoundmatch,setisfoundmatch] = useState<boolean>(false);
    const [isplay,setisplay] = useState<boolean>(false);
    const [player1isclick,setplayer1isclick] = useState<boolean>(true);
    const [player2isclick,setplayer2isclick] = useState<boolean>(false);
    const playerref = useRef<any>(null);
    const symbol = useRef<string>("");
    const tableref = useRef<any>([]);
    const getindexclick = useRef<number[]>([]);
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const table = ["","","","","","","","",""];

    //!get data player
    
    useEffect(() => {
        const getDataPlayer = async () => {
            try{
                setwait(true);
                const res = await axios.get(url + "/user/verifyuser",{withCredentials:true});
                if (res.status === 200) {
                    setdataplayer(res.data.data);
                    setwait(false);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        getDataPlayer();
    },[]);

    //!

    //!socket api client

    useEffect(() => {
        if (dataplayer) {
            socket.emit("useronline", dataplayer.id);

            socket.emit("findmatch", {username:dataplayer.name,userid:dataplayer.id});
            socket.on("findmatch", (foundmatch) => {
                playerref.current = foundmatch;

                if (foundmatch.player1.userid == dataplayer.id) {
                    setisplay(true);
                    symbol.current = "x_white.svg";
                }
                else {
                    symbol.current = "o_white.svg";
                }

                setisfoundmatch(true);
            });

            socket.on("outofgame", (outofgame) => {
                if (outofgame) {
                    if (outofgame.player1 === dataplayer.id || outofgame.player2 === dataplayer.id) {
                        alert("Player Leave the Game.");
                        window.location.href = "/game";
                    }
                }
            });

             socket.on("switchplayer", (switchdata) => {
                if (switchdata) {
                    if (dataplayer.id === switchdata.player1 ||dataplayer.id === switchdata.player2) {
                        if (dataplayer.id !== switchdata.userid) {
                            const createimg = document.createElement("img");

                            getindexclick.current = switchdata.clicktable;

                            createimg.src = switchdata.symbol;
                            createimg.style.width = "120px";

                            tableref.current[switchdata.index].appendChild(createimg);

                            setplayer1isclick(switchdata.player1isclick);
                            setplayer2isclick(switchdata.player2isclick);
                            setisplay(switchdata.canclick);
                        }
                    }
                }
             });
        }

        return () => {
          socket.off("useronline");
          socket.off("findmatch");
          socket.off("outofgame");
          socket.off("switchplayer");
        };
    },[dataplayer]);

    //!

    //!click x or o

    const click = (element:any,index:number) => {
        if (isplay) {
            if (getindexclick.current.includes(index)) return; 
            getindexclick.current.push(index);
            
            const createimg = document.createElement("img");

            createimg.src = symbol.current;
            createimg.style.width = "120px";

            element.appendChild(createimg);

            setplayer1isclick(!player1isclick);
            setplayer2isclick(!player2isclick);
            setisplay(false);

            socket.emit("switchplayer",{
                userid:dataplayer?.id,
                player1:playerref.current.player1.userid,
                player2:playerref.current.player2.userid,
                index:index,
                symbol:symbol.current,
                canclick:true,
                clicktable:getindexclick.current,
                player1isclick:!player1isclick,
                player2isclick:!player2isclick
            }); 
        }
    }

    //!

    return(
        <div className="h-full flex justify-center items-center">
            {isfoundmatch ? 
                <div>
                    <div className="grid grid-cols-3 text-center mb-[10px] font-bold">
                        <p className={player1isclick ? "text-[#6bf46b]":""}>{playerref.current.player1.username}</p>
                        <p>VS</p>
                        <p className={player2isclick ? "text-[#6bf46b]":""}>{playerref.current.player2.username}</p>
                    </div>
                    <div className="border border-white grid grid-cols-3 grid-rows-3">
                        {table.map((e,i) => (
                            <div key={i} onClick={(e) => click(e.target,i)} ref={(e:any) => tableref.current[i] = e} className="border border-white w-[150px] h-[150px] flex justify-center items-center"></div>
                        ))}
                    </div>
                </div>
                :
                <div>
                    <p className="text-[30px] font-bold">FIND MATCH</p>
                    <Preload/>
                </div>
            }
        </div>
    );
}

//?first queue = first player