import React from 'react';
import {
    View, Image, ScrollView, Button, TextInput
} from 'react-native';
import { Video } from 'expo-av';
import * as Texts from '../constants/Texts';
import ViewShot from "react-native-view-shot";
import { YoutubeVideo } from '../constants/YoutubeVideo';


export default class HomeScreen extends React.Component {
    
    state = { 
        text : '',
        srcUrl: '',
        showVideo: false,
        captures: []
    };
    
    render() { 
        if (!this.state.showVideo) {
            return (
                <View style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                    <TextInput
                          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                          onChangeText={text => this.setState({ text })}
                          value={this.state.text}
                          placeholder={Texts.default.enterUrlText}
                      />
                      <Button
                          style={{ 
                              height: 40, 
                              borderColor: 'gray', 
                              borderWidth: 1   
                          }}
                          onPress={this.getVideoSource}
                          disabled={!this.state.text}
                          title={Texts.default.buttonText}
                      />
                </View>
              );
        } else {
            return (
                <View style={{
                        flex: 1,
                        flexDirection: 'column'
                    }}
                >
                    <ViewShot ref="viewShot" 
                        options={{ format: "jpg", quality: 0.9 }}>
                        <Video
                            source={{ uri: this.state.srcUrl }}
                            useNativeControls={true}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            style={{ height: 300 }}
                            ref={video => { this.video = video; }}
                            />
                    </ViewShot>
                    <Button
                        style={{ 
                            height: 40, 
                            borderColor: 'gray', 
                            borderWidth: 1   
                        }}
                        title={Texts.default.getScreenshotText}
                        onPress={this.captureScreen}
                    />
                    <ScrollView ref={view => { this.main = view; }}>
                        {this.state.captures.map(capture => (
                            <Image key={capture}
                                   source={{uri: capture}}
                                   style={{height: 300}} />
                        ))}
                    </ScrollView>
                </View>
              );
        }
    }
 
    getVideoSource = () => {
        if (this.state.text) {
            let urlParts = this.state.text.split('/');
            let vid = urlParts[urlParts.length - 1];
            new YoutubeVideo(vid, (video) => {
                if (video && video.source) {
                    let firstQuality = Object.keys(video.source)[0];
                    let src = video.source[firstQuality].original_url;
                    
                    this.setState({
                        text: this.state.text,
                        srcUrl: src,
                        showVideo: true,
                        captures: []
                    });
                }
            });
        }
    }

    captureScreen = () => {
        let that = this;
        this.refs.viewShot.capture().then(uri => {
            that.state.captures.unshift(uri);
            that.setState({...that.state});
        })
    };
}