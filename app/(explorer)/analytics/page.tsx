import { redirect } from 'next/navigation'
import React from 'react'

const Analytics: React.FC<{}> = () => {
  redirect('/ranking/brc20')
}

export default Analytics
