import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Picker,
  ScrollView,
} from 'react-native';

import {
  Text,
  Divider,
  ListItem,
  Button,
  Icon,
  Card,
} from 'react-native-elements';

/**
 * Post metrics
 * 
 * ownerId = currentUserId
 * ownerEmail = ...
 * postId = default ObjId
 * category : Side-project || p2p learning
 * postDate = new Date();
 * postContent: TextInput
 *  
 */

function CreatePostModal (props) {
  //States for TextInput boxes' height
  const [ contentBoxHeight, setContentBoxHeight ] = useState(0);
  const [ prefBoxHeight, setPrefBoxHeight ] = useState(0);

  // States for post metrics
  const [ postCategory, setPostCategory ] = useState('dummyValue');
  const [ postContent, setPostContent ] = useState('');
  const [ preferred, setPreferred ] = useState('');

  // States for post handler
  const [ postToInsert, setPostToInsert ] = useState(null)
  const [ isReady, setIsReady ] = useState(false);

  // Handle close modal.
  // This returns bool val to visible props of Modal in MyDeskScreen.js
  const handleClose = () => {
    props.onPost(false);
  }

  // Handle constructing post that ready to insert
  const handleSetPostToInsert = () => {
    setPostToInsert({
      category: postCategory, 
      content: postContent, 
      preferred: preferred,
    });
  }

  // Handle post new post. 
  // This would check for post value and perform constructing post with ready value
  const handlePost = () => {
    if (!isReady && postToInsert==null && postContent!='' && preferred!='') {
      handleSetPostToInsert();
      setIsReady(true);
    } else {
      alert('Please fill out all the post\'s content before posting it.');
      return
    }
  }

  // Wait for post to be fully updated with filled value. Then return it to MyDeskScreen
  useEffect(() => {
    if(isReady) {
      props.postToInsert(postToInsert);
      handleClose();
    }
  }, [isReady]);  

  return(
    <ScrollView>
      <View style={{ flexDirection: 'column', marginTop: 35}}>
        <Card
          containerStyle={{ height: '97%' }}
          title="Create new Post"
        >
          <View style={{flexDirection: 'column', marginTop: 15 }}>
            <Text style={{fontSize: 20, marginVertical: 5}}>Pick a category for this post:</Text>
            <Picker
              selectedValue={postCategory}
              style={{ alignSelf: 'center', width: '100%'}}
              itemStyle={{ fontSize: 17, height: 100 }}
              onValueChange={(itemValue, itemIndex) => setPostCategory(itemValue)}
            >
              <Picker.Item label="Select a category this post.." value="dummyValue" />
              <Picker.Item label="Project" value="project" />
              <Picker.Item label="Peer to Peer Learning" value="p2pLearning" />
              <Picker.Item label="Game of Throne" value="got" />
              <Picker.Item label="This is just" value="t1" />
              <Picker.Item label="to expand" value="t2" />
              <Picker.Item label="this picker" value="t3" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
          <Divider />

          <View style={{marginTop: 15}}>
            <Text style={{fontSize: 20, marginVertical: 5}}>What's this post about:</Text>
            <TextInput 
              style={{ 
                  fontSize: 18, 
                  borderRadius: 5, 
                  borderWidth: 0.5, 
                  borderColor: 'blue',
                  height: Math.max(100, contentBoxHeight),
                  }}
              autoFocus={true}
              multiline={true}
              numberOfLines={10}
              placeholder="What's your plan?"
              onContentSizeChange={(event) => {
                  setContentBoxHeight(Math.min(event.nativeEvent.contentSize.height, 200))
              }}
              onChangeText={(content) => setPostContent(content)}
            />
          </View>

          <View style={{marginTop: 15}}>
            <Text style={{fontSize: 18, marginVertical: 5}}>Preferred experience:</Text>
            <TextInput 
              style={{ 
                  fontSize: 17, 
                  borderRadius: 5, 
                  borderWidth: 0.5, 
                  borderColor: 'blue',
                  height: Math.max(50, prefBoxHeight),
                  }}
              autoFocus={false}
              multiline={true}
              numberOfLines={10}
              placeholder="What do you expect from your crews"
              onContentSizeChange={(event) => {
                  setPrefBoxHeight(Math.min(event.nativeEvent.contentSize.height, 100))
              }}
              onChangeText={(content) => setPreferred(content)}
            />
            <Button
              titleStyle={{ fontSize: 22}}
              title="Post"
              style={{ marginTop: 15 }}
              onPress={handlePost}
            />
            <Button
              titleStyle={{ fontSize: 22}}
              title="Cancel"
              style={{ width: 100, marginTop: 40, alignSelf: 'center'}}
              type="clear"
              onPress={handleClose}
            />
          </View>
        </Card>
      </View>
    </ScrollView>

  )
}
export default CreatePostModal;