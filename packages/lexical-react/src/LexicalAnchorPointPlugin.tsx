/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useEffect} from 'react';

function useAnchorPoint(): void {
  useEffect(() => {
    console.log('foo')
  }, []);
}

export function AnchorPointPlugin() {
  const [editor] = useLexicalComposerContext()

  useAnchorPoint()

  return null
}
