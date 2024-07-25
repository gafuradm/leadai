import dynamic from 'next/dynamic'

const DynamicPage = dynamic(() => import('./MainPage'), {
  ssr: false,
})

export default function Page() {
  return <DynamicPage />
}