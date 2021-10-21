import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const images = [
    'https://frontend-collective.github.io/react-image-lightbox/1.0d2c9d24.jpg',
    'https://frontend-collective.github.io/react-image-lightbox/2.a8dae120.jpg',
];

export default class LightboxExample extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photoIndex: 0,
            isOpen: false,
            imageTitle: '',
        };
    }

    render() {
        const { photoIndex, isOpen } = this.state;

        return (
            <div>
                <button type="button" onClick={() => this.setState({ isOpen: true })}>
                    Open Lightbox
                </button>

                {isOpen && (
                    <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        imageTitle={this.state.imageTitle}
                        onMovePrevRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + images.length - 1) % images.length,
                                imageTitle: photoIndex
                            })
                        }
                        onMoveNextRequest={() =>
                            this.setState({
                                photoIndex: (photoIndex + 1) % images.length,
                                imageTitle: photoIndex
                            })
                        }
                    />
                )}
            </div>
        );
    }
}