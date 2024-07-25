import dynamic from 'next/dynamic'

const DynamicRegisterPage = dynamic(() => import('./RegisterPage'), {
  ssr: false,
})

export default function Page() {
  return <DynamicRegisterPage />
}