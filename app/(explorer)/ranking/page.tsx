import { redirect } from 'next/navigation'
import React from 'react'

const Ranking: React.FC<{}> = () => {
  redirect('/ranking/brc20')
}

export default Ranking
