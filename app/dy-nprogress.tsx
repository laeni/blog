'use client'

import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect } from 'react';

export default function DyNProgress() {
  const pathname = usePathname()

  // 导航进度条
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  }, [pathname]);

  return <></>
}
