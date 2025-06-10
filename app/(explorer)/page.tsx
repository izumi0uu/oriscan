import { redirect } from 'next/navigation'
import React from 'react'

const RankingRedirect: React.FC<{}> = () => {
  redirect('/ranking/brc20')
}

export default RankingRedirect
