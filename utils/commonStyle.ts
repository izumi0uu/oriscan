import { css } from 'styled-components'

export const pcStyle = (style: any) => {
  return css`
    @media screen and (min-width: 750px) {
      ${style}
    }
  `
}

export const mobileStyle = (style: any) => {
  return css`
    @media screen and (max-width: 750px) {
      ${style}
    }
  `
}
