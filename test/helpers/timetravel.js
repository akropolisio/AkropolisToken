const jsonrpc = '2.0'
const id = 0
const send = (method, params = []) =>
    web3.currentProvider.send({ id, jsonrpc, method, params }, () => {})
const timeTravel = async function (seconds) {
    await send('evm_increaseTime', [seconds])
    await send('evm_mine')
}
module.exports = timeTravel