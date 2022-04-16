import type { TokenManagerState } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import styled from '@emotion/styled'

export const StyledTag = styled.span`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    border: none;
    background: none;
    display: block;
    width: 100%;
  }
  button {
    margin: 5px 0px;
  }
`

export const Tag = styled.div<{ state: TokenManagerState }>`
  display: flex;
  color: white;
  font-size: 12px;
  cursor: pointer;
  color: red;
`
