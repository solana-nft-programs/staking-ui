import styled from '@emotion/styled'
import { darken } from 'polished'

type BkgProps = {
  dark?: boolean
  colors?: { primary?: string; secondary?: string }
}

export const StyledBackground = styled.div<BkgProps>`
  z-index: -1;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: ${(props) =>
    props.colors
      ? `linear-gradient(-45deg, ${darken(
          0.5,
          props.colors.secondary || ''
        )}, ${props.colors.primary}, ${darken(
          0.5,
          props.colors.secondary || ''
        )})`
      : props.dark
      ? 'linear-gradient(-45deg, #200028, #000000, #002e38)'
      : 'linear-gradient(-45deg, #ee7752, #e7cae4, #23a6d5, #23d5ab)'};
  // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 200% 200%;
  animation: gradient 10s ease infinite;
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`

export const StyledBackgroundStatic = styled.div<{ dark?: boolean }>`
  z-index: -1;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background: ${(props) =>
    props.dark
      ? 'linear-gradient(-45deg, #200028, #000000, #002e38)'
      : 'linear-gradient(-45deg, #ee7752, #e7cae4, #23a6d5, #23d5ab)'};
  // background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 100% 100%;
`
