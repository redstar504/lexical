/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {$createAutoLinkNode, $isAutoLinkNode, $isLinkNode} from '@lexical/link';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$createTextNode, $isTextNode, LexicalEditor, TextNode} from 'lexical';
import {useEffect} from 'react';

// export const URL_REGEX = /https?:\/\/([\w-]+\.)*\w([\w-@?^=%&:/~+#]*)?/
// export const URL_REGEX = /(ftp|http)s?:\/\/(.+:.+@)?([\w-]+\.(?!$|\s))*\w*[\w-@?^=%&:/~()+#]*(\.\w+)(?<=\/)/
// export const URL_REGEX = /(ftp|http|https):\/\/(.+:.+@)?(([\w-]+\.(?!$|\s))|([\w-]+)+)+\w*[\w-~+?=#%&:/]*(\.\w+)*/
// next one works good
// export const URL_REGEX = /(ftp|http|https):\/\/(.+:.+@)?([\w-]+\.(?!$|\s))+\w*[\w-~+?=#%&:/]*(\.\w+)*/
// export const URL_REGEX = /((ftp|http|https):\/\/(.+:.+@)?)?([\w-/]+\.(?!$|\s))+\w*(:\d+)?([?/#][\w-~+?=#%&:/]*)?/

type Anchor = {
  index: number
  length: number
  text: string
  url: string
}

export type AnchorPoint = (text: string) => Anchor | null

export function createAnchorPoint(
  pattern: RegExp,
  transform: (text: string) => string = (text) => text,
) {
  return (text: string) => {
    const match = pattern.exec(text);
    return match ? {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: transform(match[0]),
    } : null;
  };
}

export function findNextAnchor(
  text: string,
  points: AnchorPoint[],
): Anchor | null {
  for (let i = 0; i < points.length; i++) {
    const anchor = points[i](text);
    if (anchor) {
      return anchor;
    }
  }

  return null;
}

function useAnchorPoint(editor: LexicalEditor, points: AnchorPoint[]): void {
  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      let currentNode = textNode;
      const parent = textNode.getParentOrThrow();
      const prevSibling = textNode.getPreviousSibling();

      // extract matches from within the text node
      if (!textNode.isSimpleText() || $isAutoLinkNode(parent)) {
        return;
      }

      // Handle appending additional matching URL text to a previous link node
      if (prevSibling && $isAutoLinkNode(prevSibling)) {
        const prevText = prevSibling.getTextContent();
        const nodeText = textNode.getTextContent();
        const combinedText = prevText + nodeText;
        let anchor;

        while((anchor = findNextAnchor(combinedText, points))) {
          // console.log(anchor)
        }

        const rematch = findNextAnchor(combinedText, points);

        if (!rematch || prevSibling.getTextContent().includes(rematch.text)) {
          return;
        }

        const prevLinkTextNode = prevSibling.getFirstChild();

        if (!$isTextNode(prevLinkTextNode) || !prevLinkTextNode.isSimpleText()) {
          return;
        }

        // append to the autolink node, and subtract from the text node for each additional match
        const numCharsToShift = rematch.length - prevText.length;
        textNode.setTextContent(nodeText.substring(numCharsToShift));
        prevLinkTextNode.setTextContent(rematch.text);
        prevSibling.setURL(rematch.url);

        // TODO: reset the selection to the end of the shifted text node
      }

      if (!$isLinkNode(parent)) {
        const nodeText = textNode.getTextContent();
        const anchor = findNextAnchor(nodeText, points);

        if (!anchor) {
          return;
        }

        const matchOffset = anchor.index;
        const matchLength = anchor.length;
        let matchedNode;

        if (matchOffset === 0) {
          [matchedNode, currentNode] = currentNode.splitText(matchLength);
        } else {
          [, matchedNode, currentNode] = currentNode.splitText(matchOffset, matchOffset + matchLength);
        }

        const linkNode = $createAutoLinkNode(anchor.url);
        linkNode.append($createTextNode(anchor.text));
        matchedNode.replace(linkNode);
      }
    });
  }, [editor, points]);
}

export function AnchorPointPlugin({points}: {points: AnchorPoint[]}) {
  const [editor] = useLexicalComposerContext();
  useAnchorPoint(editor, points);
  return null;
}
