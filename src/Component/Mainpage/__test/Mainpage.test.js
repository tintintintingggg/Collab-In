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

// test('ChatInput Emoji UI Test', () => {
//     const props = {
//         showEmojis: true
//     }
//     const component = renderer.create(<EmojiList {...props} />)
//     const tree = component.toJSON()
//     // component.root.findAllByType('span')[0].props.onClick();
//     component.root.findAllByType('span').forEach((item)=>{
//         item.props.onClick();
//     });
//     expect(tree).toMatchSnapshot();
// })

