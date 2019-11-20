import React from 'react';
import {
    View, ImageBackground, ScrollView, 
    Button, Text, TouchableOpacity
} from 'react-native';
import { Video } from 'expo-av';
import * as Texts from '../constants/Texts';
import ViewShot from 'react-native-view-shot';

/**
 * Capture screenshots from video
 */
export default class VideoShots extends React.Component {
    
    state = { captures: [] };
    
    render() { 
        return (
            <View style={{
                    flex: 1,
                    flexDirection: 'column'
                }}
            >
                <ViewShot ref="viewShot" 
                    options={{ format: "jpg", quality: 0.9 }}>
                    <Video
                        source={{ uri: this.props.src }}
                        useNativeControls={true}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
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
                        <TouchableOpacity key={capture.position} 
                            onPress={() => this.moveToPosition(capture.position)}>
                            <ImageBackground
                                source={{uri: capture.uri}}
                                style={{height: 300}}>
                                <View style={{position: 'absolute', top: 0, right: 0}}>
                                    <Text style={{color: 'red'}}>
                                        {capture.position}ms
                                    </Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    moveToPosition = (millis) => {
        this.video.setPositionAsync(millis);
    }; 

    captureScreen = async () => {
        let status = await this.video.getStatusAsync();
        let uri = await this.refs.viewShot.capture();
        this.state.captures.unshift({
            uri, position: status.positionMillis
        });
        this.setState({...this.state});
    };
}