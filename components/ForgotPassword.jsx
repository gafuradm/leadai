import dynamic from 'next/dynamic'

const DynamicRegisterPage = dynamic(() => import('./FGPage'), {
  ssr: false,
})

export default function Page() {
  return <DynamicRegisterPage />
}