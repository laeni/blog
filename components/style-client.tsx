'use client'

import { useEffect, useState } from "react"

export default function StyleClient({ children }: { children: string }) {
  const [value, setValue] = useState<string>();
  useEffect(() => setValue(children), [])

  // 初始时返回空，即 SSR 时得到的为空（SSR也不需要样式），之后在客户端水合后才展示，否则由于框架bug导致 SSR 得到 children 会被转码，进而导致客户端水合时报错
  if (value) {
    return <style children={children} />
  } else {
    return <></>
  }
}
