import {DiscussionEmbed} from "disqus-react"
import classNames from "classnames";
import React from "react";
const DisqusComments = ({ post }) => {
    const disqusShortname = "montybalboa"
    const disqusConfig = {
        url: "https://your-site-url/post-slug",
        identifier: '1', // Single post id
        title: 'title' // Single post title
    }
    return (
        <div style={{width:'100%'}}>
            <div style={{fontSize:'1.5em', textAlign:'center'}} >Shout into the void</div>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>
    )
}
export default DisqusComments;