import {EmojiList} from '../ChatApp/ChatInput';
import React from 'react';
import renderer from 'react-test-renderer';

test('ChatInput Emoji UI Test', () => {
    const props = {
        showEmojis: false
    }
    const tree = renderer.create(<EmojiList {...props} />).toJSON()
    expect(tree).toMatchSnapshot();
})
test('ChatInput Emoji UI Test', () => {
    const props = {
        showEmojis: true
    }
    const tree = renderer.create(<EmojiList {...props} />).toJSON()
    expect(tree).toMatchSnapshot();
})