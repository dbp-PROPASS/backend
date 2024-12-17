const { getConnection } = require('../config/dbConfig');

// 게시글과 댓글 조회
const getPostsAndComments = async (comId) => {
  const query = `
    SELECT 
      p.POST_ID, p.POST_TITLE, p.POST_CONTENT, u.NICKNAME AS AUTHOR,
      cmt.COMMENT_ID, cmt.COMMENT_CONTENT, cmember.NICKNAME AS COMMENT_AUTHOR
    FROM COMMUNITYPOST p
    JOIN COMMUNITY c ON p.COM_ID = c.COM_ID
    JOIN MEMBER u ON p.MEM_ID = u.MEM_ID
    LEFT JOIN COMMUNITYCOMMENT cmt ON p.POST_ID = cmt.POST_ID
    LEFT JOIN MEMBER cmember ON cmt.MEM_ID = cmember.MEM_ID
    WHERE TRIM(p.COM_ID) = :comId
    ORDER BY CAST(p.POST_ID AS NUMBER) DESC, CAST(cmt.COMMENT_ID AS NUMBER) ASC
  `;

  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(query, { comId });
    return result.rows;
  } finally {
    if (connection) await connection.close();
  }
};

// 댓글 추가
const addCommentToPost = async (postId, author, content) => {
  const insertQuery = `
    INSERT INTO COMMUNITYCOMMENT (COMMENT_ID, COMMENT_CONTENT, POST_ID, MEM_ID)
    VALUES (COMMENT_SEQ.NEXTVAL, :content, :postId, 
      (SELECT MEM_ID FROM MEMBER WHERE TRIM(EMAIL) = TRIM(:author)))
  `;

  const getLastCommentQuery = `
    SELECT cmt.COMMENT_ID, cmt.COMMENT_CONTENT, u.NICKNAME AS AUTHOR
    FROM COMMUNITYCOMMENT cmt
    JOIN MEMBER u ON cmt.MEM_ID = u.MEM_ID
    WHERE cmt.POST_ID = :postId
    ORDER BY CAST(cmt.COMMENT_ID AS NUMBER) DESC
    FETCH FIRST 1 ROWS ONLY
  `;

  let connection;
  try {
    connection = await getConnection();
    await connection.execute(insertQuery, { postId, author, content }, { autoCommit: true });

    const result = await connection.execute(getLastCommentQuery, { postId });
    return result.rows.length > 0 ? result.rows[0] : null;
  } finally {
    if (connection) await connection.close();
  }
};

// 작성자의 댓글 개수 조회
const getCommentCountByAuthor = async (author) => {
  const query = `
    SELECT COUNT(c.COMMENT_ID) AS comment_count
    FROM COMMUNITYCOMMENT c
    JOIN MEMBER m ON c.MEM_ID = m.MEM_ID
    WHERE m.EMAIL = :author
  `;

  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(query, { author });
    return result.rows[0][0]; // 댓글 개수 반환
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = {
  getPostsAndComments,
  addCommentToPost,
  getCommentCountByAuthor,
};
