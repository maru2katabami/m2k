import { create } from "zustand"

export const Zustand = create(( set, get ) => ({ 
  modelA: { name: "ASSISTANT", content: "You are helpful assistant."}, setModelA: state => set({ modelA: state }),
  modelB: { name: "USER", content: "You are an assistant who asks specific questions."}, setModelB: state => set({ modelB: state }),
  temperature: 1, setTemperature: state => set({ temperature: state }),
  max_tokens: 256, setMax_tokens: state => set({ max_tokens: state }),
  top_p: 1, setTop_p: state => set({ top_p: state }),
  messages: [], setMessages: state => set({ messages: state }),
}))