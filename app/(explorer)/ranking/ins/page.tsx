import { redirect } from 'next/navigation'
import React from 'react'

const InsRedirect: React.FC<{}> = () => {
  redirect('/ranking/collections')
}

export default InsRedirect
