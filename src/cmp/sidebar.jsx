import React, { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { ChatUI } from "@/utils/chatui"
import { Zustand } from "@/lib/zustand"

export const Sidebar = () => {

  const [ open, setOpen ] = useState( false )

  const { data } = useSession()
  
  const { modelA, setModelA, modelB, setModelB, temperature, setTemperature, max_tokens, setMax_tokens, top_p, setTop_p } = Zustand()

  const { active, handleSubmit } = ChatUI()

  return (
    <div
      className={`absolute top-0 size-full flex justify-end items-center ${ open ? "bg-black/80 pointer-events-auto": "pointer-events-none"} duration-500`}
      id="close"
      onClick={ event => { if ( event.target.id === "close") setOpen( false )}}>
      <div
        className={`relative p-5 pt-8 space-y-5 ${ open ? "pl-10 w-80": "pl-0 w-5"} h-[500px] rounded-l-3xl bg-white border-2 border-r-0 border-black duration-500 pointer-events-auto`}>
        { open && <>
        <TextArea model={ modelA } setModel={ setModelA }/>
        <TextArea model={ modelB } setModel={ setModelB }/>
        <Range title="temperature" max={ 1 } min={ 0 } step={ 0.01 } value={ temperature } setValue={ setTemperature }/>
        <Range title="max_tokens" max={ 4096 } min={ 256 } step={ 4 } value={ max_tokens } setValue={ setMax_tokens }/>
        <Range title="top_p" max={ 1 } min={ 0 } step={ 0.01 } value={ top_p } setValue={ setTop_p }/>
        <button
          className="w-full h-10 rounded-xl bg-black bg-center bg-no-repeat text-white font-black flex justify-center items-center"
          onClick={() => data ? signOut(): signIn("google")}>
          { data ? "SIGN OUT": "SIGN IN"}
        </button>
        </>}
        <div
          className="absolute top-0 left-0 w-5 h-full flex justify-center items-center group"
          onClick={() => setOpen( !open )}>
          <div
            className="w-2 h-40 group-hover:h-60 rounded bg-black duration-500"/>
        </div>
      </div>
      <div
        className={`absolute bottom-5 right-5 size-10 rounded-3xl bg-white bg-center bg-no-repeat border-2 ${ active && "animate-spin"} pointer-events-auto`}
        style={{ backgroundImage: `url(${ data?.user.image || "/img/google.png"})`, backgroundSize: "100%"}}
        onClick={ handleSubmit }/>
    </div>
  )
}

const TextArea = ({ model, setModel }) => {

  const [ input, setInput ] = useState( false )
  const [ textarea, setTextarea ] = useState( false )

  return (
    <div
      className={`relative w-full rounded-xl border-2 ${ textarea && "border-indigo-500"} overflow-visible`}>
      <input
        className={`absolute -top-4 left-3 px-2 rounded-3xl bg-white border-2 ${ input ? "border-indigo-500": "text-gray-300"} text-center text-xs font-semibold`}
        defaultValue={ model.name }
        onFocus={() => setInput( true )}
        onBlur={() => setInput( false )}
        onChange={ event => setModel({ name: event.target.value, content: model.content })}/>
      <textarea
        className={`p-2 w-full h-20 ${ !textarea && "text-gray-300"} resize-none overflow-y-scroll`}
        rows={ 1 }
        defaultValue={ model.content }
        onFocus={() => setTextarea( true )}
        onBlur={() => setTextarea( false )}
        onChange={ event => {
          event.target.style.height = "auto"
          event.target.style.height = `${ event.target.scrollHeight }px`
          setModel({ name: model.name, content: event.target.value })
        }}/>
    </div>
  )
}

const Range = ({ title, max, min, step, value, setValue }) => {

  const [ focus, setFocus ] = useState( false )

  return (
    <div
      className={`relative px-2 space-x-2 w-full h-10 rounded-xl border-2 ${ focus && "border-indigo-500"} flex items-center overflow-visible`}>
      <div
        className={`absolute px-1 -top-2 left-3 bg-white ${ focus ? "text-indigo-500": "text-gray-300"} text-xs font-semibold`}>
        { title }
      </div>
      <input
        className="flex-1 h-full"
        type="range"
        max={ max }
        min={ min }
        step={ step }
        value={ value }
        onPointerDown={() => setFocus( true )}
        onPointerOut={() => setFocus( false )}
        onPointerUp={() => setFocus( false )}
        onChange={ event => setValue( event.target.value )}/>
      <div
        className={`w-10 ${ focus ? "text-indigo-500": "text-gray-300"} text-center font-semibold`}>
        { value }
      </div>
    </div>
  )
}