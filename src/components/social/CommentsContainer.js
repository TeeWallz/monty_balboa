import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';

import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import DisqussContainer from "./DisqussContainer";


const styles = theme => ({

});

class CommentsContainer extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>

                {/*<DiscussionEmbed*/}
                {/*    shortname='example'*/}
                {/*    config={*/}
                {/*        {*/}
                {/*            url: 'localhost:3000',*/}
                {/*            identifier: 'montybalboa',*/}
                {/*            title: 'My Title',*/}
                {/*        }*/}
                {/*    }*/}
                {/*/>*/}

                <DisqussContainer />

            </div>
        )
    }
}

CommentsContainer.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(CommentsContainer)
