import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params: { id: string }
}
const Brc20Redirect: React.FC<Props> = ({ params }) => {
  const id = params.id
  redirect(`/coin/brc20/${id}`)
}

export default Brc20Redirect
