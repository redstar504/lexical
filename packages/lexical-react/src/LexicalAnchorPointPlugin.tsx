/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';
import {LexicalEditor, TextNode} from 'lexical';

// export const URL_REGEX = /https?:\/\/([\w-]+\.)*\w([\w-@?^=%&:/~+#]*)?/
// export const URL_REGEX = /(ftp|http)s?:\/\/(.+:.+@)?([\w-]+\.(?!$|\s))*\w*[\w-@?^=%&:/~()+#]*(\.\w+)(?<=\/)/
// export const URL_REGEX = /(ftp|http|https):\/\/(.+:.+@)?(([\w-]+\.(?!$|\s))|([\w-]+)+)+\w*[\w-~+?=#%&:/]*(\.\w+)*/
// next one works good
// export const URL_REGEX = /(ftp|http|https):\/\/(.+:.+@)?([\w-]+\.(?!$|\s))+\w*[\w-~+?=#%&:/]*(\.\w+)*/

export const URL_REGEX = /(ftp|http|https):\/\/(.+:.+@)?([\w-/]+\.(?!$|\s))+\w*(:\d+)?([?/#][\w-~+?=#%&:/]*)?/

function useAnchorPoint(editor: LexicalEditor): void {
  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      // extract matches from within the text node


    })
  }, [editor]);
}

export function AnchorPointPlugin() {
  const [editor] = useLexicalComposerContext()

  useAnchorPoint(editor)

  return null
}
