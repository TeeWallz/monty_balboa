import React, {Component} from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import Chumps from "../../data/chumps"; // This only needs to be imported once in your app

const images = [
    'https://frontend-collective.github.io/react-image-lightbox/1.0d2c9d24.jpg',
    'https://frontend-collective.github.io/react-image-lightbox/2.a8dae120.jpg',
];

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
            // photoIndex: 0,
            // // isOpen: false,
            // // imageTitle: '11010\n' + this.props.chumps[0].chumps[0].name,
            // imageTitle: chumps[0].date + " - " + chumps[0].chumps[0].name,
        };
    }

    openMe() {
        console.log("openMe")
    }

    render() {
        const photoIndex = this.props.lightboxCurrentChumpId;
        const isOpen = this.props.lightboxIsOpen

        return (
            <div>
                {isOpen && (
                    <Lightbox
                        reactModalStyle={customStyles}
                        mainSrc={this.state.bouts[photoIndex].chumps[0].image}
                        nextSrc={this.state.bouts[(photoIndex + 1) % this.state.bouts.length].chumps[0].image}
                        prevSrc={this.state.bouts[(photoIndex + this.state.bouts.length - 1) % this.state.bouts.length].chumps[0].image}
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