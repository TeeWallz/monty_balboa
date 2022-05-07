import React, {Component} from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Chumps from "../../data/chumps"; // This only needs to be imported once in your app


const customStyles = {
    content: {
        fontSize: '1em',
    },
};

export default class LightboxExample extends Component {
    constructor(props) {
        super(props);
        const chumps = Chumps();

        this.state = {
            bouts: chumps,
        };
    }

    render() {
        const photoIndex = this.props.lightboxCurrentChumpId;
        const isOpen = this.props.lightboxIsOpen

        

        return (
            <div>
                {isOpen && (
                    <Lightbox
                        reactModalStyle={customStyles}
                        mainSrc={this.state.bouts[photoIndex].image.split('.').pop() == 'webm' ? this.state.bouts[photoIndex].thumb : this.state.bouts[photoIndex].image}
                        nextSrc={this.state.bouts[(photoIndex + 1) % this.state.bouts.length].image}
                        prevSrc={this.state.bouts[(photoIndex + this.state.bouts.length - 1) % this.state.bouts.length].image}
                        onCloseRequest={() => this.props.setLightboxData({lightboxIsOpen: false})}
                        imageTitle={this.props.lightboxTitle(photoIndex)}
                        onMovePrevRequest={() => {
                            const idx = (photoIndex + this.state.bouts.length - 1) % this.state.bouts.length;

                            this.props.setLightboxData({
                                lightboxCurrentChumpId: idx,
                                lightboxTitle: this.props.lightboxTitle(idx),
                            })
                        }}
                        onMoveNextRequest={() => {
                            const idx = (photoIndex + 1) % this.state.bouts.length;

                            this.props.setLightboxData({
                                lightboxCurrentChumpId: idx,
                                lightboxTitle: this.props.lightboxTitle(idx),
                            })
                        }}
                    />
                )}
            </div>
        );
    }
}