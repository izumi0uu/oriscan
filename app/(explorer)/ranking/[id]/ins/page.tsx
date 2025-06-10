import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: { id: string }
}
const InsRedirect: React.FC<Props> = ({ params }) => {
  const id = params.id
  redirect(`/collections/${id}`)
}

export default InsRedirect
