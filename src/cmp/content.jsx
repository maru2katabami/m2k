import React, { useEffect, useRef, useState } from "react"
import { Zustand } from "@/lib/zustand"

export const Content = () => {

  const scroller = useRef()

  const { messages } = Zustand()

  useEffect(() => {
    scroller.current.scrollTop = scroller.current.scrollHeight
  }, [ messages ])

  return (
    <div
      className="absolute top-0 p-7 size-full bg-black bg-center bg-[size:32px_32px] overflow-y-scroll"
      style={{ backgroundImage: "linear-gradient( #333 1px, transparent 1px), linear-gradient(to right, #333 1px, transparent 1px)"}}
      ref={ scroller }>
      { messages.map(( item, index ) => (
      <Message item={ item } key={ index }/>
      ))}
    </div>
  )
}

const Message = ({ item }) => {

  const textRef = useRef()
  const { modelA, modelB, messages ,setMessages } = Zustand()
  const { role, content, createdAt } = item
  const [ edit, setEdit ] = useState( false )

  useEffect(() => {
    if( edit ) {
      textRef.current.style.height = `${ textRef.current.scrollHeight }px`
      textRef.current.focus() 
      textRef.current.setSelectionRange(textRef.current.value.length, textRef.current.value.length)
    }
  }, [ edit ])

  return (
    <div
      className={`pb-2 w-full flex flex-wrap ${ role === "user" ? "justify-end": "justify-start"} items-center overflow-visible`}
      key={ createdAt }>
      <div
        className={`px-2 w-full text-white text-xs font-semibold flex ${ role === "user" ? "justify-end": "justify-start"}`}>
        { role === "user" ? modelB.name: modelA.name }
      </div>
      { edit ?
      <form
        className={`max-w-[90%] w-full rounded-3xl ${ role === "user" ? "rounded-tr-lg": "rounded-tl-lg"} bg-white flex flex-wrap`}
        onSubmit={ event => {
          event.preventDefault()
          setMessages( messages.map( msg => msg.createdAt === createdAt ? { ...msg, content: event.target[0].value } : msg ))
          setEdit( false )
        }}>
        <textarea
          className="px-3 py-2 w-full resize-none"
          rows={ 1 }
          ref={ textRef }
          defaultValue={ content }
          onChange={ event => {
            event.target.style.height = "auto"
            event.target.style.height = `${ event.target.scrollHeight }px`
          }}/>
        <div
          className="p-1 w-full flex justify-end">
          <button
            className="mx-2 w-20 h-8 rounded-3xl bg-gray-300 font-semibold cursor-pointer"
            type="button"
            onClick={() => setEdit( false )}>
            Cancel
          </button>
          <button
            className="w-20 h-8 rounded-3xl bg-black text-white font-semibold cursor-pointer"
            type="submit">
            Submit
          </button>
        </div>
      </form>:
      <div
        className={`max-w-[90%] rounded-3xl ${ role === "user" ? "rounded-tr-lg": "rounded-tl-lg"} bg-white flex flex-wrap`}
        onClick={() => setEdit( !edit )}>
        <div
          className="px-3 py-2 bg-gradient-to-r from-blue-800 to-blue-400 bg-clip-text text-transparent font-semibold">
          { content }
        </div>
      </div>
      }
    </div>
  )
}