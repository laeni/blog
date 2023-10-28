'use client'

import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';
import { FloatButton } from 'antd';
import dynamic from 'next/dynamic';

export default function Globals({
  children
}: {
  children: React.ReactNode
}) {
  // 代码块使用动态加载,且服务端不加载,否则其中需要用到window而报错
  const DyNProgress = dynamic(
    () => import('./dy-nprogress'),
    { loading: () => <></>, ssr: false }
  )

  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      {children}
      <DyNProgress />
      {/* "回到顶部"按钮 */}
      <div><FloatButton.BackTop className='bottom-28 sm:bottom-[50px]' /></div>
      <style>{`@media screen and (max-width: 640px) {.ant-back-top {right: 20px;}}`}</style>
    </StyleProvider>
  )
}
