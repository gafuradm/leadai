import dynamic from 'next/dynamic'

const DynamicRegisterPage = dynamic(() => import('./LoginPage'), {
  ssr: false,
})

export default function Page() {
  return <DynamicRegisterPage />
}