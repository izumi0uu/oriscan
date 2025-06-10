import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: { type2: string; id: string }
}
const TypeRedirect: React.FC<Props> = ({ params }) => {
  const type2 = params.type2
  const id = params.id
  redirect(`/analytics/${id}/${type2}`)
}

export default TypeRedirect
