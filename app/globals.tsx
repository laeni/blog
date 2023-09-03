'use client'

import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import { usePathname } from 'next/navigation';

export default function Globals({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // 导航进度条
  // TODO 警告
  // NProgress.start()
  // useEffect(() => {
  //   NProgress.done()
  // }, [pathname]);

  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      {children}
      {/* "回到顶部"按钮 */}
      {/* TODO 警告 */}
      {/* <FloatButton.BackTop className='bottom-28 sm:bottom-[50px]' /> */}
      <style>{`@media screen and (max-width: 640px) {.ant-back-top {right: 20px;}}`}</style>
    </StyleProvider>
  )
}
