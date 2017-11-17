CREATE DATABASE IF NOT EXISTS finger_blog;
USE finger_blog;


-- 用户 --
CREATE TABLE IF NOT EXISTS user (
	id INT UNSIGNED NOT NULL auto_increment,	-- 用户id
	role INT UNSIGNED NOT NULL,					-- 用户角色 0->管理员 1->用户
	username VARCHAR(50) NOT NULL,				-- 登录名
	email VARCHAR(50) NOT NULL,					-- 邮箱
	password VARCHAR(100) NOT NULL, 			-- 登录密码
	nickname VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,	-- 用户昵称，可能有一些表情符啥的
	password_reset_token VARCHAR(100), 			-- 重置密码
	created_at BIGINT UNSIGNED,					-- 创建时间
	updated_at BIGINT UNSIGNED,					-- 最后修改时间
	PRIMARY KEY (id),
	UNIQUE (username)
)ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 文章分类 --
CREATE TABLE IF NOT EXISTS article_type (
	id INT UNSIGNED NOT NULL auto_increment,	-- 文章分类id
	name VARCHAR(50) NOT NULL,					-- 文章分类name
	created_at BIGINT UNSIGNED,					-- 创建时间
	updated_at BIGINT UNSIGNED,					-- 最后修改时间updateData
	PRIMARY KEY (id),
	unique (name)
)ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 文章 --
CREATE TABLE IF NOT EXISTS article (
	id BIGINT UNSIGNED NOT NULL auto_increment,	-- 文章id
	type INT UNSIGNED NOT NULL,					-- 文章分类
	title VARCHAR(100),							-- 文章标题
	`desc` VARCHAR(100),						-- 文章简介
	label VARCHAR(100),							-- 文章label
	cover VARCHAR(100),							-- 文章封面图片
	content_md TEXT,							-- 文章markdown内容
	content_render TEXT,						-- 文章渲染内容
	is_show TINYINT UNSIGNED NOT NULL default 0,-- 是否显示文章
	rank TINYINT UNSIGNED NOT NULL default 1,	-- 排序等级
	created_at BIGINT UNSIGNED,					-- 创建时间
	updated_at BIGINT UNSIGNED,					-- 修改时间
	PRIMARY KEY (id),
	FOREIGN KEY (type) REFERENCES article_type(id) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 增加文章浏览量 --
ALTER TABLE article ADD view_count INT DEFAULT 0;

-- 修改发布状态字段名 --
ALTER TABLE article CHANGE is_show is_publish TINYINT UNSIGNED NOT NULL DEFAULT 0;

-- 增加删除字段 --
ALTER TABLE article ADD is_delete TINYINT UNSIGNED NOT NULL DEFAULT 0;