import React from 'react';
import webrtc from 'webrtc-adapter';

const videoOptions = { 
  height: { ideal: 512 },
  width: { ideal: 288 }
}

class VideoChat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      constraints: { 
        audio: true, 
        video: videoOptions
      },
      err: null,
    }
    this.requestVideoFeed = this.requestVideoFeed.bind(this)
  }

  componentDidMount() {
    this.requestVideoFeed()
  }

  requestVideoFeed() {
    let video = document.getElementById('myVideo')

    navigator.mediaDevices.getUserMedia(this.state.constraints)
    .then(stream => {
      video.src = stream;
    })
    .catch(err => {
      this.setState({err: err})
    })
  }
  render() {
    return (
      <div>
        <video id='myVideo' autoPlay></video>
      </div>
    )
  }
}

export default VideoChat