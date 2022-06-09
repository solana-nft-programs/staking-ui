import { IEthereumProvider } from 'eip1193-provider';
import { BaseConfig } from '../../constants';
import BloctoProviderInterface from './blocto.d';

export declare interface EthereumProviderConfig extends BaseConfig {
  chainId: string | number | null;
  rpc?: string;
  server?: string;
}

export interface EIP1193RequestPayload {
  id?: number;
  jsonrpc?: string;
  method: string;
  params?: Array<any>;
}

export declare interface EthereumProviderInterface extends BloctoProviderInterface, IEthereumProvider {
  chainId: string | number;
  networkId: string | number;
  chain: string;
  net: string;
  rpc: string;
  server: string;
  accounts: Array<string>;
  request(args: EIP1193RequestPayload): Promise<any>;
}

