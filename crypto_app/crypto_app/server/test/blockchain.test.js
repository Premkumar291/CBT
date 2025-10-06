const Blockchain = require('../models/Blockchain');

describe('Blockchain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test('should create genesis block', () => {
    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0].data).toBe('Genesis Block');
  });

  test('should add new block', () => {
    const previousLength = blockchain.chain.length;
    const newData = { vote: 'candidate1', voter: 'user123' };
    
    const newBlock = blockchain.addNewBlock(newData);
    
    expect(blockchain.chain.length).toBe(previousLength + 1);
    expect(blockchain.chain[previousLength].data).toEqual(newData);
  });

  test('should verify blockchain integrity', () => {
    // Add a few blocks
    const data1 = { vote: 'candidate1', voter: 'user123' };
    const data2 = { vote: 'candidate2', voter: 'user456' };
    
    blockchain.addNewBlock(data1);
    blockchain.addNewBlock(data2);
    
    // Verify chain is valid
    expect(blockchain.isChainValid()).toBe(true);
  });
});