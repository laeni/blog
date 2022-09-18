import { useEffect, useState } from "react"

export default function ShowSize() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(process.env.NODE_ENV == 'development');
  }, []);

  return (
    <>
      {show && (
        <div className="absolute top-0 left-0 z-[99] opacity-20 pointer-events-none">
          <span className="block sm:hidden">xs</span>
          <span className="hidden sm:block md:hidden">sm</span>
          <span className="hidden md:block lg:hidden">md</span>
          <span className="hidden lg:block xl:hidden">lg</span>
          <span className="hidden xl:block 2xl:hidden">xl</span>
          <span className="hidden 2xl:block">2xl</span>
        </div>
      )}
    </>
  )
}
