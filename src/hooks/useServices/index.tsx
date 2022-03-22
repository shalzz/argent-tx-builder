import { useState, useEffect } from 'react';
import Web3 from 'web3';
import WalletConnectProvider from "@walletconnect/web3-provider";

import InterfaceRepository from './interfaceRepository';
import { InterfaceRepo } from './interfaceRepository';

export interface Services {
  provider: WalletConnectProvider | undefined;
  chainId: number | undefined;
  web3: Web3 | undefined;
  interfaceRepo: InterfaceRepo | undefined;
}

export default function useServices(): Services {
  const [provider, setProvider] = useState<WalletConnectProvider | undefined>();
  const [web3, setWeb3] = useState<Web3 | undefined>();
  const [chainId, setChainId] = useState<number>(1);
  const [interfaceRepo, setInterfaceRepo] = useState<InterfaceRepository | undefined>();

  useEffect(() => {
    const providerInstance: any = new WalletConnectProvider({
        infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
    });

    const web3Instance = new Web3(providerInstance);

    setProvider(providerInstance);
    setWeb3(web3Instance);
  }, [chainId]);

  useEffect(() => {
    if (web3 === undefined) {
      return
    }

    const getChainInfo = async () => {
      try {
        const chainId = await web3?.eth.getChainId();
        const interfaceRepo = new InterfaceRepository(chainId!.toString());

        setChainId(chainId);
        setInterfaceRepo(interfaceRepo);
      } catch (error) {
        console.error('Unable to get chain info:', error);
      }
    };

    getChainInfo();
  }, [web3]);

  return {
    provider,
    chainId,
    web3,
    interfaceRepo,
  };
}
