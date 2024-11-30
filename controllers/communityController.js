const oracledb = require('oracledb');
const { getConnection } = require('../config/dbConfig'); // DB 설정 파일 경로

const community = async (req, res) => {
  const { category } = req.query;

  const categoryToComId = {
    it: '2',
    english: '3',
    finance: '4',
    tech: '5',
    medical: '6',
    edu: '7',
    design: '8',
    food: '9',
    architect: '10',
    national: '11',
  };
  const comId = String(categoryToComId[category]); // 명시적으로 문자열 변환  

  if (!comId) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  let connection;

  try {
    connection = await getConnection();

    // 게시글과 댓글을 가져오는 쿼리
    const query = `
      SELECT 
        p.POST_ID, p.POST_TITLE, p.POST_CONTENT, u.NICKNAME AS AUTHOR,
        cmt.COMMENT_ID, cmt.COMMENT_CONTENT, cmember.NICKNAME AS COMMENT_AUTHOR
      FROM COMMUNITYPOST p
      JOIN COMMUNITY c ON p.COM_ID = c.COM_ID
      JOIN MEMBER u ON p.MEM_ID = u.MEM_ID
      LEFT JOIN COMMUNITYCOMMENT cmt ON p.POST_ID = cmt.POST_ID
      LEFT JOIN MEMBER cmember ON cmt.MEM_ID = cmember.MEM_ID  -- 댓글 작성자의 NICKNAME을 가져오기 위해 추가
      WHERE TRIM(p.COM_ID) = :comId
      ORDER BY p.POST_TITLE DESC, cmt.COMMENT_ID

    `;

    const result = await connection.execute(query, { comId: String(comId) });

    // 게시글과 댓글 데이터를 그룹화해서 반환
    const posts = result.rows.reduce((acc, row) => {
      const postId = row[0];
      const post = acc.find((post) => post.postId === postId);

      // 게시글이 이미 존재하면 댓글 추가
      if (post) {
        if (row[4]) {
          post.comments.push({
            commentId: row[4],
            content: row[5],
            author: row[6],
          });
        }
      } else {
        // 새 게시글 추가
        acc.push({
          postId: row[0],
          title: row[1],
          content: row[2],
          author: row[3],
          comments: row[4]
            ? [{
                commentId: row[4],
                content: row[5],
                author: row[6],
              }]
            : [],
        });
      }
      return acc;
    }, []);

    res.json(posts);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

module.exports = { community };
