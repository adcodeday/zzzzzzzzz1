const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ message: '数据库连接成功', data: rows });
  } catch (error) {
    res.status(500).json({ message: '数据库连接失败', error: error.message });
  }
});

// 获取表列表
app.get('/api/tables', async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    res.json({ tables: rows });
  } catch (error) {
    res.status(500).json({ message: '获取表列表失败', error: error.message });
  }
});

// 通用获取表数据
app.get('/api/tables/:tableName', async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const [rows] = await pool.query(`SELECT * FROM ${tableName} LIMIT 100`);
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: '获取表数据失败', error: error.message });
  }
});

// ==================== 商品接口 ====================
app.post('/api/tables/products', async (req, res) => {
  const { name, price, originalPrice, sales, categoryId, tags, image, amount } = req.body;
  try {
    await pool.query(
      'INSERT INTO products (name, price, originalPrice, sales, categoryId, tags, image, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, price, originalPrice, sales, categoryId, tags, image, amount]
    );
    res.json({ success: true, message: '数据添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '添加失败', error: error.message });
  }
});

app.put('/api/tables/products/:id', async (req, res) => {
  const id = req.params.id;
  const { name, price, originalPrice, sales, categoryId, tags, image, amount } = req.body;
  try {
    await pool.query(
      'UPDATE products SET name=?, price=?, originalPrice=?, sales=?, categoryId=?, tags=?, image=?, amount=? WHERE id=?',
      [name, price, originalPrice, sales, categoryId, tags, image, amount, id]
    );
    res.json({ success: true, message: '数据修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '修改失败', error: error.message });
  }
});

app.delete('/api/tables/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM products WHERE id=?', [id]);
    res.json({ success: true, message: '数据删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败', error: error.message });
  }
});

// ==================== 任务接口 ====================
app.post('/api/tables/tasks', async (req, res) => {
  const { "任务名称": name, "起始时间": startTime, "结束时间": endTime, "任务地点": location, "任务状态": status, "任务报酬": reward, "任务详情": detail, "已报名人数": signupCount } = req.body;
  try {
    await pool.query(
      'INSERT INTO tasks (`任务名称`, `起始时间`, `结束时间`, `任务地点`, `任务状态`, `任务报酬`, `任务详情`, `已报名人数`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, startTime, endTime, location, status, reward, detail, signupCount]
    );
    res.json({ success: true, message: '任务添加成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '添加失败', error: error.message });
  }
});

app.put('/api/tables/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const { "任务名称": name, "起始时间": startTime, "结束时间": endTime, "任务地点": location, "任务状态": status, "任务报酬": reward, "任务详情": detail, "已报名人数": signupCount } = req.body;
  try {
    await pool.query(
      'UPDATE tasks SET `任务名称`=?, `起始时间`=?, `结束时间`=?, `任务地点`=?, `任务状态`=?, `任务报酬`=?, `任务详情`=?, `已报名人数`=? WHERE id=?',
      [name, startTime, endTime, location, status, reward, detail, signupCount, id]
    );
    res.json({ success: true, message: '任务修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '修改失败', error: error.message });
  }
});

app.delete('/api/tables/tasks/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM tasks WHERE id=?', [id]);
    res.json({ success: true, message: '任务删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败', error: error.message });
  }
});

// 接取任务（已报名人数 +1）
app.post('/api/tables/tasks/:id/accept', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('UPDATE tasks SET `已报名人数` = `已报名人数` + 1 WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: '任务不存在' });
    res.json({ success: true, message: '接取成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '接取失败', error: error.message });
  }
});

// ==================== 订单接口 ====================
// 新增订单（order_id 自增，不需要传）
app.post('/api/tables/orders', async (req, res) => {
  const { user_id, goods, buyer, seller, order_time, order_amount, order_status } = req.body;
  try {
    await pool.query(
      'INSERT INTO orders (user_id, goods, buyer, seller, order_time, order_amount, order_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, goods, buyer, seller, order_time, order_amount, order_status]
    );
    res.json({ success: true, message: '订单创建成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '创建订单失败', error: error.message });
  }
});

app.put('/api/tables/orders/:id', async (req, res) => {
  const id = req.params.id;
  const { user_id, goods, buyer, seller, order_time, order_amount, order_status } = req.body;
  try {
    await pool.query(
      'UPDATE orders SET user_id=?, goods=?, buyer=?, seller=?, order_time=?, order_amount=?, order_status=? WHERE order_id=?',
      [user_id, goods, buyer, seller, order_time, order_amount, order_status, id]
    );
    res.json({ success: true, message: '订单更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新失败', error: error.message });
  }
});

app.delete('/api/tables/orders/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM orders WHERE order_id=?', [id]);
    res.json({ success: true, message: '订单删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败', error: error.message });
  }
});

// ==================== 用户接口 ====================
app.post('/api/login', async (req, res) => {
  const { userName, passWord } = req.body;
  try {
    const [users] = await pool.query(
      'SELECT id, userName, nickName, tel, local, authority, png FROM user WHERE userName = ? AND passWord = ?',
      [userName, passWord]
    );
    if (users.length === 0) return res.status(401).json({ success: false, message: '用户名或密码错误' });
    res.json({ success: true, message: '登录成功', user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: '登录失败', error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  const { userName, passWord, nickName, tel, local, authority } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM user WHERE userName = ?', [userName]);
    if (existing.length > 0) return res.status(400).json({ success: false, message: '用户名已存在' });
    if (authority !== 0 && authority !== 1 && authority !== 2) return res.status(400).json({ success: false, message: '权限值无效' });
    await pool.query(
      'INSERT INTO user (userName, passWord, nickName, tel, local, authority) VALUES (?, ?, ?, ?, ?, ?)',
      [userName, passWord, nickName, tel, local, authority]
    );
    res.json({ success: true, message: '注册成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '注册失败', error: error.message });
  }
});

app.get('/api/tables/user', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, userName, passWord, nickName, tel, local, authority, png FROM user LIMIT 100');
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: '获取用户列表失败', error: error.message });
  }
});

app.get('/api/tables/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(
      'SELECT id, userName, passWord, nickName, tel, local, authority, png FROM user WHERE id = ?', [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: '用户不存在' });
    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败', error: error.message });
  }
});

app.put('/api/tables/user/:id', async (req, res) => {
  const id = req.params.id;
  const { userName, passWord, nickName, tel, local, authority, png } = req.body;
  try {
    if (userName) {
      const [existing] = await pool.query('SELECT id FROM user WHERE userName = ? AND id != ?', [userName, id]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: '用户名已被使用' });
    }
    if (authority !== undefined && authority !== 0 && authority !== 1 && authority !== 2) {
      return res.status(400).json({ success: false, message: '权限值无效' });
    }
    let updateFields = [], queryParams = [];
    if (userName) { updateFields.push('userName = ?'); queryParams.push(userName); }
    if (passWord) { updateFields.push('passWord = ?'); queryParams.push(passWord); }
    if (nickName) { updateFields.push('nickName = ?'); queryParams.push(nickName); }
    if (tel) { updateFields.push('tel = ?'); queryParams.push(tel); }
    if (local) { updateFields.push('local = ?'); queryParams.push(local); }
    if (authority !== undefined) { updateFields.push('authority = ?'); queryParams.push(authority); }
    if (png !== undefined) { updateFields.push('png = ?'); queryParams.push(png); }
    if (updateFields.length === 0) return res.json({ success: true, message: '无更新内容' });
    queryParams.push(id);
    await pool.query(`UPDATE user SET ${updateFields.join(', ')} WHERE id = ?`, queryParams);
    res.json({ success: true, message: '用户信息更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '更新失败', error: error.message });
  }
});

app.delete('/api/tables/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [users] = await pool.query('SELECT id FROM user WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: '用户不存在' });
    await pool.query('DELETE FROM user WHERE id = ?', [id]);
    res.json({ success: true, message: '用户删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败', error: error.message });
  }
});

app.post('/api/changePassword', async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  if (!id || !oldPassword || !newPassword) return res.status(400).json({ success: false, message: '参数缺失' });
  try {
    const [users] = await pool.query('SELECT id FROM user WHERE id = ? AND passWord = ?', [id, oldPassword]);
    if (users.length === 0) return res.status(401).json({ success: false, message: '旧密码不正确' });
    await pool.query('UPDATE user SET passWord = ? WHERE id = ?', [newPassword, id]);
    res.json({ success: true, message: '密码修改成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '密码修改失败', error: error.message });
  }
});

// ==================== 文件上传 ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const uploadDir = path.join(__dirname, 'uploads/avatars');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: '没有文件被上传' });
    res.json({ success: true, message: '文件上传成功', url: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ success: false, message: '文件上传失败', error: error.message });
  }
});

app.post('/api/user/avatar/:userId', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!req.file) return res.status(400).json({ success: false, message: '没有上传文件' });
    const avatarPath = '/uploads/avatars/' + req.file.filename;
    await pool.query('UPDATE user SET png = ? WHERE id = ?', [avatarPath, userId]);
    res.json({ success: true, message: '头像上传成功', avatarPath });
  } catch (error) {
    res.status(500).json({ success: false, message: '头像上传失败', error: error.message });
  }
});

// 执行自定义 SQL
app.post('/api/sql', async (req, res) => {
  const { sql } = req.body
  if (!sql) return res.status(400).json({ success: false, message: 'SQL 不能为空' })
  try {
    const [result] = await pool.query(sql)
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: '执行失败', error: error.message })
  }
})

// ==================== 助农社区接口 ====================

// ------------------------------------------------------------
// 帖子列表
// GET /api/community/posts?type=&page=&limit=
//   type  : 不传=全部  1=好物推荐  2=助农任务
//   page  : 页码，默认 1
//   limit : 每页条数，默认 10
// ------------------------------------------------------------
app.get('/api/community/posts', async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    // 构建 WHERE 条件
    const conditions = ['p.status != 0'];
    const params = [];
    if (type) {
      conditions.push('p.type = ?');
      params.push(parseInt(type));
    }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    // 查帖子列表，同时 JOIN user 表取发帖人昵称和头像
    const [rows] = await pool.query(
      `SELECT
         p.id, p.type, p.title, p.content, p.image,
         p.reward, p.start_time, p.end_time, p.location,
         p.max_people, p.signup_count,
         p.like_count, p.comment_count, p.status, p.created_at,p.product_ids,
         u.id AS user_id, u.nickName AS user_nick, u.userName AS user_name, u.png AS user_avatar
       FROM community_posts p
       LEFT JOIN user u ON p.user_id = u.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // 查总数
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM community_posts p ${where}`,
      params
    );

    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取帖子列表失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 帖子详情（含是否已点赞、是否已报名）
// GET /api/community/posts/:id?user_id=
// ------------------------------------------------------------
app.get('/api/community/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  try {
    const [[post]] = await pool.query(
      `SELECT
         p.*, u.id AS user_id, u.nickName AS user_nick,
         u.userName AS user_name, u.png AS user_avatar
       FROM community_posts p
       LEFT JOIN user u ON p.user_id = u.id
       WHERE p.id = ? AND p.status != 0`,
      [id]
    );
    if (!post) return res.status(404).json({ success: false, message: '帖子不存在' });

    // 当前用户是否已点赞
    let is_liked = false;
    let is_signed_up = false;
    if (user_id) {
      const [[likeRow]] = await pool.query(
        'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
        [id, user_id]
      );
      is_liked = !!likeRow;

      if (post.type === 2) {
        const [[signupRow]] = await pool.query(
          'SELECT id FROM post_signups WHERE post_id = ? AND user_id = ? AND status != 0',
          [id, user_id]
        );
        is_signed_up = !!signupRow;
      }
    }

    res.json({ success: true, data: { ...post, is_liked, is_signed_up } });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取帖子详情失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 发布帖子（农户/管理员）
// POST /api/community/posts
// Body: { user_id, type, title, content, image?,
//         reward?, start_time?, end_time?, location?, max_people? }
// ------------------------------------------------------------
app.post('/api/community/posts', async (req, res) => {
  const {
    user_id, type, title, content, image,
    reward, start_time, end_time, location, max_people,
    product_ids
  } = req.body;

  // 基础校验
  if (!user_id || !type || !title || !content) {
    return res.status(400).json({ success: false, message: '参数缺失：user_id / type / title / content 为必填项' });
  }
  if (![1, 2].includes(parseInt(type))) {
    return res.status(400).json({ success: false, message: 'type 只能为 1（好物推荐）或 2（助农任务）' });
  }
  if (parseInt(type) === 2 && (!reward || !start_time || !end_time || !location || !max_people)) {
    return res.status(400).json({ success: false, message: '助农任务帖子需填写：reward / start_time / end_time / location / max_people' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO community_posts 
        (user_id, type, title, content, image, reward, start_time, end_time, location, max_people, product_ids) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id, parseInt(type), title, content, image || null,
        reward || null, start_time || null, end_time || null,
        location || null, max_people ? parseInt(max_people) : null,
        product_ids || null
      ]
    );
    res.json({ success: true, message: '发布成功', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: '发布失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 删除帖子
// DELETE /api/community/posts/:id
// Body: { user_id, authority }
//   农户只能删自己的帖子，管理员可删任意帖子
// ------------------------------------------------------------
app.delete('/api/community/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, authority } = req.body;

  try {
    const [[post]] = await pool.query('SELECT user_id FROM community_posts WHERE id = ?', [id]);
    if (!post) return res.status(404).json({ success: false, message: '帖子不存在' });

    // 权限校验：管理员(0)可删全部，其他人只能删自己的
    if (parseInt(authority) !== 0 && post.user_id !== parseInt(user_id)) {
      return res.status(403).json({ success: false, message: '无权限删除该帖子' });
    }

    await pool.query('DELETE FROM community_posts WHERE id = ?', [id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 下架帖子（管理员，软删除）
// PUT /api/community/posts/:id/status
// Body: { status }  0=下架  1=恢复正常
// ------------------------------------------------------------
app.put('/api/community/posts/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE community_posts SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: '状态更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '状态更新失败', error: error.message });
  }
});


// ==================== 评论接口 ====================

// ------------------------------------------------------------
// 获取帖子评论列表
// GET /api/community/posts/:id/comments
// ------------------------------------------------------------
app.get('/api/community/posts/:id/comments', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT
         c.id, c.content, c.created_at,
         u.id AS user_id, u.nickName AS user_nick,
         u.userName AS user_name, u.png AS user_avatar
       FROM post_comments c
       LEFT JOIN user u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [id]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取评论失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 发表评论（所有登录用户）
// POST /api/community/posts/:id/comments
// Body: { user_id, content }
// ------------------------------------------------------------
app.post('/api/community/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { user_id, content } = req.body;

  if (!user_id || !content || !content.trim()) {
    return res.status(400).json({ success: false, message: '评论内容不能为空' });
  }

  try {
    // 确认帖子存在
    const [[post]] = await pool.query('SELECT id FROM community_posts WHERE id = ? AND status != 0', [id]);
    if (!post) return res.status(404).json({ success: false, message: '帖子不存在' });

    // 插入评论
    const [result] = await pool.query(
      'INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [id, user_id, content.trim()]
    );

    // 更新帖子评论计数
    await pool.query('UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = ?', [id]);

    res.json({ success: true, message: '评论成功', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: '评论失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 删除评论
// DELETE /api/community/posts/:id/comments/:commentId
// Body: { user_id, authority }
// ------------------------------------------------------------
app.delete('/api/community/posts/:id/comments/:commentId', async (req, res) => {
  const { id, commentId } = req.params;
  const { user_id, authority } = req.body;

  try {
    const [[comment]] = await pool.query('SELECT user_id FROM post_comments WHERE id = ? AND post_id = ?', [commentId, id]);
    if (!comment) return res.status(404).json({ success: false, message: '评论不存在' });

    if (parseInt(authority) !== 0 && comment.user_id !== parseInt(user_id)) {
      return res.status(403).json({ success: false, message: '无权限删除该评论' });
    }

    await pool.query('DELETE FROM post_comments WHERE id = ?', [commentId]);
    // 更新评论计数，最低为 0
    await pool.query(
      'UPDATE community_posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = ?',
      [id]
    );

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '删除失败', error: error.message });
  }
});


// ==================== 点赞接口 ====================

// ------------------------------------------------------------
// 点赞 / 取消点赞（同一用户重复调用自动切换）
// POST /api/community/posts/:id/like
// Body: { user_id }
// ------------------------------------------------------------
app.post('/api/community/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ success: false, message: '缺少 user_id' });

  try {
    // 查是否已点赞
    const [[existing]] = await pool.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existing) {
      // 已点赞 → 取消点赞
      await pool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [id, user_id]);
      await pool.query(
        'UPDATE community_posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = ?',
        [id]
      );
      res.json({ success: true, liked: false, message: '已取消点赞' });
    } else {
      // 未点赞 → 点赞
      await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [id, user_id]);
      await pool.query('UPDATE community_posts SET like_count = like_count + 1 WHERE id = ?', [id]);
      res.json({ success: true, liked: true, message: '点赞成功' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '操作失败', error: error.message });
  }
});


// ==================== 报名接口 ====================

// ------------------------------------------------------------
// 报名任务
// POST /api/community/posts/:id/signup
// Body: { user_id, remark? }
// ------------------------------------------------------------
app.post('/api/community/posts/:id/signup', async (req, res) => {
  const { id } = req.params;
  const { user_id, remark } = req.body;

  if (!user_id) return res.status(400).json({ success: false, message: '缺少 user_id' });

  try {
    // 确认是任务帖子且状态正常
    const [[post]] = await pool.query(
      'SELECT id, type, max_people, signup_count, status FROM community_posts WHERE id = ?',
      [id]
    );
    if (!post) return res.status(404).json({ success: false, message: '帖子不存在' });
    if (post.type !== 2) return res.status(400).json({ success: false, message: '该帖子不是助农任务' });
    if (post.status === 0) return res.status(400).json({ success: false, message: '该任务已下架' });
    if (post.signup_count >= post.max_people) {
      return res.status(400).json({ success: false, message: '报名人数已满' });
    }

    // 检查是否已报名（status != 0 表示有效报名）
    const [[existing]] = await pool.query(
      'SELECT id, status FROM post_signups WHERE post_id = ? AND user_id = ?',
      [id, user_id]
    );
    if (existing && existing.status !== 0) {
      return res.status(400).json({ success: false, message: '您已报名该任务' });
    }

    if (existing && existing.status === 0) {
      // 之前取消过，重新激活
      await pool.query(
        'UPDATE post_signups SET status = 1, remark = ?, updated_at = NOW() WHERE post_id = ? AND user_id = ?',
        [remark || null, id, user_id]
      );
    } else {
      // 新报名
      await pool.query(
        'INSERT INTO post_signups (post_id, user_id, remark) VALUES (?, ?, ?)',
        [id, user_id, remark || null]
      );
    }

    // 更新报名计数
    await pool.query('UPDATE community_posts SET signup_count = signup_count + 1 WHERE id = ?', [id]);

    res.json({ success: true, message: '报名成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '报名失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 取消报名
// DELETE /api/community/posts/:id/signup
// Body: { user_id }
// ------------------------------------------------------------
app.delete('/api/community/posts/:id/signup', async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ success: false, message: '缺少 user_id' });

  try {
    const [[existing]] = await pool.query(
      'SELECT id, status FROM post_signups WHERE post_id = ? AND user_id = ?',
      [id, user_id]
    );
    if (!existing || existing.status === 0) {
      return res.status(400).json({ success: false, message: '您尚未报名该任务' });
    }

    // 软删除：status 改为 0
    await pool.query(
      'UPDATE post_signups SET status = 0, updated_at = NOW() WHERE post_id = ? AND user_id = ?',
      [id, user_id]
    );

    // 更新报名计数，最低为 0
    await pool.query(
      'UPDATE community_posts SET signup_count = GREATEST(signup_count - 1, 0) WHERE id = ?',
      [id]
    );

    res.json({ success: true, message: '取消报名成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: '取消报名失败', error: error.message });
  }
});


// ------------------------------------------------------------
// 查看任务报名名单
// GET /api/community/posts/:id/signups
//   农户只能查自己帖子的名单，管理员可查全部
// Query: { user_id, authority }
// ------------------------------------------------------------
app.get('/api/community/posts/:id/signups', async (req, res) => {
  const { id } = req.params;
  const { user_id, authority } = req.query;

  try {
    // 权限校验：非管理员需验证是否为帖子作者
    if (parseInt(authority) !== 0) {
      const [[post]] = await pool.query(
        'SELECT user_id FROM community_posts WHERE id = ?',
        [id]
      );
      if (!post) return res.status(404).json({ success: false, message: '帖子不存在' });
      if (post.user_id !== parseInt(user_id)) {
        return res.status(403).json({ success: false, message: '无权限查看报名名单' });
      }
    }

    const [rows] = await pool.query(
      `SELECT
         s.id, s.status, s.remark, s.created_at,
         u.id AS user_id, u.nickName AS user_nick,
         u.userName AS user_name, u.tel, u.png AS user_avatar
       FROM post_signups s
       LEFT JOIN user u ON s.user_id = u.id
       WHERE s.post_id = ? AND s.status != 0
       ORDER BY s.created_at ASC`,
      [id]
    );

    res.json({ success: true, data: rows, total: rows.length });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取报名名单失败', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
// ==================== 商品审核接口（管理员）====================

// 获取待审核商品列表
app.get('/api/products/audit', async (req, res) => {
  const { audit_status } = req.query
  try {
    let sql = 'SELECT p.*, u.nickName AS farmer_nick, u.userName AS farmer_name FROM products p LEFT JOIN user u ON p.farmer_id = u.id'
    const params = []
    if (audit_status !== undefined) {
      sql += ' WHERE p.audit_status = ?'
      params.push(parseInt(audit_status))
    }
    sql += ' ORDER BY p.id DESC'
    const [rows] = await pool.query(sql, params)
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, message: '获取失败', error: error.message })
  }
})

// 审核商品（管理员）
app.put('/api/products/:id/audit', async (req, res) => {
  const { id } = req.params
  const { audit_status } = req.body // 1=通过 2=拒绝
  try {
    await pool.query('UPDATE products SET audit_status = ? WHERE id = ?', [audit_status, id])
    res.json({ success: true, message: audit_status === 1 ? '审核通过' : '已拒绝' })
  } catch (error) {
    res.status(500).json({ success: false, message: '操作失败', error: error.message })
  }
})

// 获取某农户的商品（含审核状态）
app.get('/api/farmer/products', async (req, res) => {
  const { farmer_id } = req.query
  if (!farmer_id) return res.status(400).json({ success: false, message: '缺少 farmer_id' })
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE farmer_id = ? ORDER BY id DESC', [farmer_id]
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, message: '获取失败', error: error.message })
  }
})

// 农户发布商品（自动设为待审核）
app.post('/api/farmer/products', async (req, res) => {
  const { name, price, originalPrice, sales = 0, categoryId, tags, image, amount, farmer_id } = req.body
  if (!farmer_id) return res.status(400).json({ success: false, message: '缺少 farmer_id' })
  try {
    await pool.query(
      'INSERT INTO products (name, price, originalPrice, sales, categoryId, tags, image, amount, farmer_id, audit_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
      [name, price, originalPrice, sales, categoryId, tags, image, amount, farmer_id]
    )
    res.json({ success: true, message: '商品已提交，等待管理员审核' })
  } catch (error) {
    res.status(500).json({ success: false, message: '发布失败', error: error.message })
  }
})

// ==================== 农户订单接口 ====================

// 农户查看涉及自己商品的订单（通过 seller 字段匹配）
app.get('/api/farmer/orders', async (req, res) => {
  const { farmer_id } = req.query
  if (!farmer_id) return res.status(400).json({ success: false, message: '缺少 farmer_id' })
  try {
    // 获取该农户的昵称/用户名，用于匹配 seller
    const [[farmer]] = await pool.query('SELECT nickName, userName FROM user WHERE id = ?', [farmer_id])
    if (!farmer) return res.status(404).json({ success: false, message: '农户不存在' })
    const farmerName = farmer.nickName || farmer.userName
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE seller = ? ORDER BY order_time DESC', [farmerName]
    )
    res.json({ success: true, data: rows, farmerName })
  } catch (error) {
    res.status(500).json({ success: false, message: '获取失败', error: error.message })
  }
})

// 农户更新订单状态（如发货）
app.put('/api/farmer/orders/:id/status', async (req, res) => {
  const { id } = req.params
  const { order_status } = req.body
  try {
    await pool.query('UPDATE orders SET order_status = ? WHERE order_id = ?', [order_status, id])
    res.json({ success: true, message: '状态更新成功' })
  } catch (error) {
    res.status(500).json({ success: false, message: '更新失败', error: error.message })
  }
})

// ==================== 帖子附带商品 ====================

// 获取农户已审核通过的商品（发帖时选择用）
app.get('/api/farmer/products/approved', async (req, res) => {
  const { farmer_id } = req.query
  if (!farmer_id) return res.status(400).json({ success: false, message: '缺少 farmer_id' })
  try {
    const [rows] = await pool.query(
      'SELECT id, name, price, image, amount FROM products WHERE farmer_id = ? AND audit_status = 1',
      [farmer_id]
    )
    res.json({ success: true, data: rows })
  } catch (error) {
    res.status(500).json({ success: false, message: '获取失败', error: error.message })
  }
})