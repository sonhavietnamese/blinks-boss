import { AnchorProvider, setProvider } from '@coral-xyz/anchor'

module.exports = async function (provider: AnchorProvider) {
  setProvider(provider)
}
