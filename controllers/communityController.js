const { getPostsAndComments, addCommentToPost, getCommentCountByAuthor } = require('../models/communityModel');

const community = async (req, res) => {
  const { category } = req.query;

  const categoryToComId = {
    business: '2',
    public: '3',
    health: '4',
    culture: '5',
    logistics: '6',
    industry: '7',
    manufacturing: '8',
    technology: '9',
    food: '10',
    environment: '11',
  };
  const comId = String(categoryToComId[category]);

  if (!comId) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const rows = await getPostsAndComments(comId);

    const posts = rows.reduce((acc, row) => {
      const postId = row[0];
      const post = acc.find((post) => post.postId === postId);

      if (post) {
        if (row[4]) {
          post.comments.push({
            commentId: row[4],
            content: row[5],
            author: row[6],
          });
        }
      } else {
        acc.push({
          postId: row[0],
          title: row[1],
          content: row[2],
          author: row[3],
          comments: row[4]
            ? [{ commentId: row[4], content: row[5], author: row[6] }]
            : [],
        });
      }
      return acc;
    }, []);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

const addComment = async (req, res) => {
  const { postId } = req.params;
  let { content, author } = req.body;

  content = content ? content.trim() : '';

  if (!content || !postId) {
    return res.status(400).json({ error: '댓글 내용과 게시글 ID가 필요합니다.' });
  }

  try {
    const comment = await addCommentToPost(postId, author, content);

    if (comment) {
      const [commentId, commentContent, authorNickname] = comment;
      res.status(201).json({
        commentId,
        content: commentContent,
        author: authorNickname,
      });
    } else {
      res.status(500).json({ error: '댓글 저장에 실패했습니다.' });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: '댓글 작성 중 오류가 발생했습니다.' });
  }
};

const getCommentCount = async (req, res) => {
  const { author } = req.query;

  try {
    const count = await getCommentCountByAuthor(author);
    res.json({ count });
  } catch (error) {
    console.error('Error in getCommentCount:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

module.exports = { community, addComment, getCommentCount };
