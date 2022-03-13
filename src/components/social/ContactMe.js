import React, {Component} from 'react';
import emailjs from 'emailjs-com';
import classNames from "classnames";
import ReCAPTCHA from "react-google-recaptcha";

import {withStyles} from "@material-ui/core/styles";
import commonStyle from "../../styles/common";
import combineStyles from "../../utils/combineStyles";

const recaptchaRef = React.createRef();

const styles = theme => ({

});

class ContactMe extends Component {
    constructor(props) {
        super(props);

        this.sendEmail = this.sendEmail.bind(this);
    }

    sendEmail(e) {
        e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it


        emailjs.sendForm('service_t38m6ba', 'template_5ote42i', e.target, 'user_U8s70N0fGhZsvrQri6yr2', )
            .then((result) => {
                alert("Message sent!")
                window.location.reload()  //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior)
            }, (error) => {
                console.log(error.text);
            });
    }


    render() {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.section, classes.sectionWidth)} style={{'alignItems': 'center'}}>
                <div className={classNames(classes.commonHeaderText)}>Report a new bout!</div>
                <div className={classNames(classes.commonBigText)} style={{'textAlign': 'center'}}>
                    If you have a picture, or have an aversion to forms, email your message/images to <a href="mailto:montybalboacontact@gmail.com">montybalboacontact@gmail.com</a>
                </div>
                <br/>
                <form onSubmit={this.sendEmail}>

                    <div className="form-group">
                        <label htmlFor="from_name">Name</label>
                        <input type="text" className="form-control" id="from_name" name="from_name"
                               aria-describedby="from_name" placeholder="Enter name (optional)" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="from_name">Email address</label>
                        <input type="email" className="form-control" id="reply_to" name="reply_to"
                               aria-describedby="reply_to" placeholder="Enter email (optional)" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="from_name">Message</label>
                        <textarea type="text" className="form-control" id="message" name="message"
                               aria-describedby="message" placeholder="Enter message" required/>
                    </div>

                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LeGfkkUAAAAANuInnTnj-edkZn4WG5QP5BsIc_m"
                    />
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}

const combinedStyles = combineStyles(styles, commonStyle);

export default withStyles(combinedStyles)(ContactMe)



