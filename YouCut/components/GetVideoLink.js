import React from 'react';
import {
    View, Button, TextInput
} from 'react-native';
import VideoShots from '../components/VideoShots';
import * as Texts from '../constants/Texts';
import { YoutubeVideo } from '../constants/YoutubeVideo';

/**
 * Get the link to the video
 */
export default class GetVideoLink extends React.Component {
    
    state = { 
        text : '',
        srcUrl: ''
    };
    
    render() { 
        if (!this.state.srcUrl) {
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
            return (<VideoShots src={this.state.srcUrl}></VideoShots>);
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
                        srcUrl: src
                    });
                }
            });
        }
    }
}