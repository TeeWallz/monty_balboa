import {DiscussionEmbed} from "disqus-react"
const DisqusComments = ({ post }) => {
    const disqusShortname = "montybalboa"
    const disqusConfig = {
        url: "https://your-site-url/post-slug",
        identifier: '1', // Single post id
        title: 'title' // Single post title
    }
    return (
        <div style={{width:'100%'}}>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>
    )
}
export default DisqusComments;