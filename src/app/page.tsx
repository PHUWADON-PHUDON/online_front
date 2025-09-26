"use client";
import { useState,useRef,useEffect } from "react";
import Formlogin from "./components/Formlogin";
import Formregister from "./components/Formregister";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import Matter from "matter-js";
gsap.registerPlugin(useGSAP,Physics2DPlugin);

export default function Home() {
  const [isclickregister,setisclickregister] = useState<boolean>(true);
  const objectsref = useRef<any>([]);

  //!gravity annimation

  useEffect(() => {
    const { Engine, Render, Runner, World, Bodies, Body, Svg }:any = Matter;
    
    // 1. Engine + World
    const engine = Engine.create();
    const world = engine.world;

    // ปิดแรงโน้มถ่วง
    engine.gravity.y = 0;
    engine.gravity.x = 0;

    // 2. Render
    const render = Render.create({
      element: objectsref.current,engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "",
        pixelRatio: window.devicePixelRatio,
      },
    });
    Render.run(render);

    // 3. Runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // 4. ลูกบอลหลายลูก
    const balls:any = [];
    for (let i = 0; i < 20; i++) {
        const isX = i % 2 === 0;
        const posX = Math.random() * (window.innerWidth - 60) + 30; // เว้น margin
        const posY = Math.random() * (window.innerHeight - 60) + 30; // ตกลงมาจากบน
        const body = Bodies.circle(posX, posY, 30, {
          restitution: 1,
          frictionAir: 0.02,
          render: {
            sprite: {
              texture: isX ? "/ximg.svg" : "/circle.svg", // ใส่ path รูป X หรือ O
              xScale: 1, // ปรับขนาด
              yScale: 1,
            }
          },
        });
        balls.push(body);
        World.add(world,body);
    }

    // 5. ขอบเขตจอ (walls)
    const walls = [
      Bodies.rectangle(window.innerWidth, 0, window.innerWidth, 20, {
        isStatic: true,
        render: { visible: false }
      }),
      Bodies.rectangle(
        window.innerWidth / 2,
        window.innerHeight,
        window.innerWidth,
        20,
        { 
            isStatic: true,
            render: { visible: false }
        }
      ),
      Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, {
        isStatic: true,
        render: { visible: false }
      }),
      Bodies.rectangle(
        window.innerWidth,
        window.innerHeight / 2,
        20,
        window.innerHeight,
        { 
            isStatic: true,
            render: { visible: false }
        }
      ),
    ];
    World.add(world, walls);

    // 6. เพิ่มแรงสุ่มเบา ๆ ให้ลูกบอลทุก ๆ 0 วินาที
    const interval = setInterval(() => {
      balls.forEach((ball:any) => {
        const forceX = (Math.random() - 0.5) * 0.001; // แรงสุ่ม X
        const forceY = (Math.random() - 0.5) * 0.001; // แรงสุ่ม Y
        Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
      });
    },0);

    // cleanup
    return () => {
      clearInterval(interval);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  },[]);

  //!

  return (
    <div className="relative overflow-hidden h-full flex flex-col justify-center items-center">
      <h1 className="text-[50px] font-bold bg-linear-to-l/decreasing from-indigo-500 to-teal-400 bg-clip-text text-transparent">X O Online</h1>
      {isclickregister ? 
        <Formlogin isclickregister={isclickregister} setisclickregister={setisclickregister}/>
        :
        <Formregister isclickregister={isclickregister} setisclickregister={setisclickregister}/>
      }

      <div ref={objectsref} className="absolute top-0 left-0 w-[100dvw] z-[-1]"></div>
    </div>
  );
}