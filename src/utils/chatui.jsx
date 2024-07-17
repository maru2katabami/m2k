import { useEffect, useState } from "react"
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm"
import { Zustand } from "@/lib/zustand"

export const ChatUI = () => {

  const [ engine, setEngine ] = useState( null )
  const [ active, setActive ] = useState( false )

  const { modelA, modelB, temperature, max_tokens, top_p, messages, setMessages } = Zustand()

  const handleInit = async ( start ) => {
    setActive( true )
    setMessages([{ role: "assistant", content: "Loading ..."}])
    const Engine = await CreateWebWorkerMLCEngine(
      new Worker( new URL("./worker.js", import.meta.url ), { type: "module"}),
      "Qwen2-1.5B-Instruct-q4f16_1-MLC",
      { initProgressCallback: ( report ) => {
        const matches = report.text.match(/cache\[(\d+)\/(\d+)\]/)
        if ( !matches ) return
        const elapsed = Math.floor(( Date.now() - start ) / 1000 )
        const progress = Number( matches[1] / matches[2]).toFixed( 2 )
        const leftTime = Math.floor(( elapsed / progress ) - elapsed )
        const formatTime = leftTime >= 60 ? `${ Math.floor( leftTime / 60 )} m ${ String( leftTime % 60 ).padStart( 2, "0")} s` : `${ leftTime } s`
        setMessages([{ role: "assistant", content: `Loading ... ${ Math.floor( progress * 100 )}% left ${ formatTime }`}])
      }}
    )
    setMessages([{ role: "assistant", content: "Loading ... Completed 🎉"}])
    setEngine( Engine )
    setActive( false )
  }

  const handleSubmit = async () => {
    setActive( true )
    const roler = messages[ messages.length - 1 ].role
    const system = { role: "system", content: roler === "user" ? modelA.content: modelB.content }
    const result = { role: roler === "user" ? "assistant": "user", content: "", usage: [], createdAt: Date.now()}
    const prompt = messages.map(({ role, content })  => (
      { role: roler === "user" ? role === "user" ? "user": "assistant": role === "user" ? "assistant": "user" , content: content }
    ))
    setMessages([ ...messages, result ])
    const chunks = await engine.chat.completions.create({
      messages: [ system, ...prompt ],
      temperature: temperature,    
      max_tokens: max_tokens,
      top_p: top_p,
      stream: true,
      stream_options: { include_usage: true },
    })
    result.content = ""
    for await ( const chunk of chunks ) {
      result.content += chunk.choices[0]?.delta.content || ""
      result.createdAt = Date.now()
      if ( chunk.usage ) result.usage = chunk.usage
      setMessages([ ...messages, result ])
    }
    setActive( false )
  }

  useEffect(() => { handleInit( Date.now())}, [])

  return { engine, active, handleSubmit }
}