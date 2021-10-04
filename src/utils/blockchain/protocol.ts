import contractReader from '../contractReader';
import { getCurrentNetwork } from '../network';
import { prefixHex } from '../helpers';

const protocol = new (class Protocol {
  public call<T = string>(fnName: string, args: any[]) {
    const { protocolContractAddress } = getCurrentNetwork();
    return contractReader.call<T>(protocolContractAddress, fnName, args);
  }

  public getLoanPoolsList(from: number, to: number) {
    return this.call<string[]>('getLoanPoolsList(uint256,uint256)', [
      from,
      to,
    ]).then(items =>
      items.map(item => prefixHex(item.slice(item.length - 40))),
    );
  }
})();

export default protocol;
