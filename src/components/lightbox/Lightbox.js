import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

const images = [
    'https://frontend-collective.github.io/react-image-lightbox/1.0d2c9d24.jpg',
    'https://frontend-collective.github.io/react-image-lightbox/2.a8dae120.jpg',
];

const customStyles = {
    content: {
        fontSize: '0.5em',
    },
};

export default class LightboxExample extends Component {
    constructor(props) {
        super(props);
        let yeet = 1;

        this.state = {
            bouts: this.props.chumps,
            photoIndex: 0,
            isOpen: false,
            // imageTitle: '11010\n' + this.props.chumps[0].chumps[0].name,
            imageTitle: this.props.chumps[0].date + " - " + this.props.chumps[0].chumps[0].name,
        };
    }

    render() {
        const { photoIndex, isOpen } = this.state;
        console.log(this.state.bouts[photoIndex].chumps[0].image);
        console.log(photoIndex);

        return (
            <div>
                <button type="button" onClick={() => this.setState({ isOpen: true })}>
                    Open Lightbox
                </button>

                {isOpen && (
                    <Lightbox
                        reactModalStyle={customStyles}
                        mainSrc={this.state.bouts[photoIndex].chumps[0].image}
                        nextSrc={this.state.bouts[(photoIndex + 1) % this.state.bouts.length].chumps[0].image}
                        prevSrc={this.state.bouts[(photoIndex + this.state.bouts.length - 1) % this.state.bouts.length].chumps[0].image}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        imageTitle={this.state.imageTitle}
                        onMovePrevRequest={() => {
                            const idx = (photoIndex + this.state.bouts.length - 1) % this.state.bouts.length;
                            this.setState({
                                photoIndex: idx,
                                imageTitle: this.props.chumps[idx].date + " - " + this.state.bouts[idx].chumps[0].name
                            })
                        }
                        }
                        onMoveNextRequest={() => {
                            const idx = (photoIndex + 1) % this.state.bouts.length;
                            this.setState({
                                photoIndex: idx,
                                imageTitle: this.props.chumps[idx].date + " - " + this.state.bouts[idx].chumps[0].name
                            })
                        }
                        }
                    />
                )}
            </div>
        );
    }
}