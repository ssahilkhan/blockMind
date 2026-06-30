import { eventRegistry } from '../registry/event.registry';
import { STANDARD_EVENT_ABIS } from '../constants/events.constants';

describe('EventRegistry', () => {
  beforeEach(() => {
    eventRegistry.init();
  });

  it('should initialize with standard ABIs', () => {
    const info = eventRegistry.getRegistryInfo();
    expect(info.standards).toEqual(expect.arrayContaining(['ERC20', 'ERC721', 'ERC1155']));
    expect(info.events.length).toBeGreaterThan(0);
  });

  it('should register a contract', () => {
    const abi = [{ type: 'event', name: 'TestEvent', inputs: [] }];
    eventRegistry.registerContract('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', abi, 'Test');
    const found = eventRegistry.findABI('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(found).toEqual(abi);
  });

  it('should find ABI case-insensitively', () => {
    const abi = [{ type: 'event', name: 'TestEvent', inputs: [] }];
    eventRegistry.registerContract('0xAbCd', abi);
    expect(eventRegistry.findABI('0xabcd')).toEqual(abi);
    expect(eventRegistry.findABI('0xABCD')).toEqual(abi);
  });

  it('should update existing contract registration', () => {
    eventRegistry.registerContract('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', [{ type: 'event', name: 'Old', inputs: [] }]);
    eventRegistry.registerContract('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', [{ type: 'event', name: 'New', inputs: [] }]);
    const found = eventRegistry.findABI('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    expect(found).toEqual([{ type: 'event', name: 'New', inputs: [] }]);
  });

  it('should return null for unregistered contract', () => {
    expect(eventRegistry.findABI('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef')).toBeNull();
  });

  it('should register custom ABI label', () => {
    const abi = [{ type: 'event', name: 'CustomEvent', inputs: [] }];
    eventRegistry.registerABI('Custom', abi);
    const abis = eventRegistry.getStandardABIs();
    expect(abis.get('Custom')).toEqual(abi);
  });

  it('should guess ERC20 from event names', () => {
    const abi = [
      { type: 'event', name: 'Transfer', inputs: [] },
      { type: 'event', name: 'Approval', inputs: [] },
    ] as const;
    expect(eventRegistry.guessStandardFromABI(abi as unknown as unknown[])).toBe('ERC20');
  });

  it('should guess ERC721 from event names', () => {
    const abi = [
      { type: 'event', name: 'Transfer', inputs: [] },
      { type: 'event', name: 'Approval', inputs: [] },
      { type: 'event', name: 'ApprovalForAll', inputs: [] },
    ] as const;
    expect(eventRegistry.guessStandardFromABI(abi as unknown as unknown[])).toBe('ERC721');
  });

  it('should guess ERC1155 from event names', () => {
    const abi = [
      { type: 'event', name: 'TransferSingle', inputs: [] },
      { type: 'event', name: 'TransferBatch', inputs: [] },
      { type: 'event', name: 'ApprovalForAll', inputs: [] },
      { type: 'event', name: 'URI', inputs: [] },
    ] as const;
    expect(eventRegistry.guessStandardFromABI(abi as unknown as unknown[])).toBe('ERC1155');
  });

  it('should guess Custom for unknown events', () => {
    const abi = [
      { type: 'event', name: 'SomeCustomEvent', inputs: [] },
    ] as const;
    expect(eventRegistry.guessStandardFromABI(abi as unknown as unknown[])).toBe('Custom');
  });
});
