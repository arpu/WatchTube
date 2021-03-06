import React from 'react';
import CommentItem from './comment_item';
import CommentForm from './comment_form';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.fetchComments = this.fetchComments.bind(this);
  }

  fetchComments() {
    const { updateComment, deleteComment } = this.props;
    let { comments, currentUser } = this.props;
    if (!comments) comments = [];

    if (currentUser) {
      if (!currentUser.avatar_url) {
        currentUser = currentUser.user;
      }
    }

    comments.sort((first, second) => {
      if (first.updated_at > second.update_at) return -1;
      if (first.updated_at < second.updated_at) return 1;
      return 0;
    });

    return comments.map((comment) => (
      <CommentItem key={ comment.id }
        currentUser={ currentUser}
        comment={ comment }
        updateComment={ updateComment }
        deleteComment={ deleteComment }/>
    ));
  }

  render() {
    const { videoId, comments, createComment } = this.props;
    let { currentUser } = this.props;

    if (currentUser) {
      if (!currentUser.avatar_url) {
        currentUser = currentUser.user;
      }
    }

    let numComments = "No comments to display";
    if(comments) numComments = comments.length;

    return(
      <div className="comments-container">
        <div className="comments-title">
          COMMENTS • {numComments}
        </div>

        <CommentForm
          videoId={ videoId }
          currentUser={ currentUser }
          processForm={ createComment } />

        <div className="comment-items-container">
          {this.fetchComments()}
        </div>
      </div>
    );
  }
}

export default Comments;
