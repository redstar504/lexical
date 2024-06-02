import {
  AnchorPointPlugin, createAnchorPoint,
} from '../../../../lexical-react/src/LexicalAnchorPointPlugin';

const URL_REGEX = /((ftp|http|https):\/\/(.+:.+@)?)?([\w-/]+\.(?!$|\s))+\w*(:\d+)?([?/#][\w-~+?=#%&:/]*)?/

const ANCHOR_POINTS = [
  createAnchorPoint(URL_REGEX, text => {
    return text.startsWith('http') ? text : `https://${text}`
  })
]

export default function LexicalAnchorPointPlugin(): JSX.Element {
  return <AnchorPointPlugin points={ANCHOR_POINTS} />
}
