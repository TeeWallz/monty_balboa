import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {withStyles} from '@material-ui/core/styles';
import combineStyles from "../../utils/combineStyles";
import commonStyle from "../../styles/common";
import cooLinks from "../../data/coolLinks.json"

const styles = theme => ({

});

class Links extends Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section, classes.sectionWidth)}>
                <div className={classNames(classes.commonHeaderText)}>Links which what I found cool</div>

                {
                    cooLinks.map((item) => {
                        return(
                            <div>
                                <img style={{width:"2em"}} src={"/images/arrow33.gif"} />
                                <a target="_blank" href={item.url}>{item.name}</a>
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" x="0px"
                                     y="0px" viewBox="0 0 100 100" width="15" height="15" className="icon outbound">
                                    <path fill="currentColor"
                                          d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path>
                                    <polygon fill="currentColor"
                                             points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon>
                                </svg>
                            </div>
                        )
                    })
                }

            </div>
        )
    }
}

Links.propTypes = {
    classes: PropTypes.object.isRequired
};

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(Links)
