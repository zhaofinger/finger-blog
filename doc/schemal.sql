create database if not exists finger_blog;
use finger_blog;


/* 用户 */
create table if not exists user (
	id int unsigned not null auto_increment,	-- 用户id
	role int unsigned not null,					-- 用户角色 0->管理员 1->用户
	username varchar(50) not null,				-- 登录名
	email varchar(50) not null,					-- 邮箱
	password varchar(100) not null, 			-- 登录密码
	nickname varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci not null,	-- 用户昵称，可能有一些表情符啥的
	password_reset_token varchar(100), 			-- 重置密码
	auth_key varchar(100) not null,				-- cookie auth
	created_at int unsigned,					-- 创建时间
	updated_at int unsigned,					-- 最后修改时间
	primary key(id),
	unique (username)
)engine=InnoDB default charset=utf8mb4;

/* 文章分类 */
create table if not exists article_type (
	id int unsigned not null auto_increment,	-- 文章分类id
	name varchar(50) not null,					-- 文章分类name
	created_at int unsigned,					-- 创建时间
	updated_at int unsigned,					-- 最后修改时间
	primary key(id),
	unique (name)
)engine=InnoDB default charset=utf8mb4;

/* 文章 */
create table if not exists article (
	id bigint unsigned not null auto_increment,	-- 文章id
	article_id int unsigned not null,			-- 文章分类
	title varchar(100),							-- 文章标题
	`desc` varchar(100),						-- 文章简介
	img varchar(1000),							-- 文章封面图片
	rank tinyint unsigned not null default 1,	-- 排序等级
 	is_lunbo boolean not null default false,	-- 是否设置为轮播
	created_at int unsigned,					-- 创建时间
	updated_at int unsigned,					-- 修改时间
	primary key(id),
	foreign key(article_id) references article_type(id) on delete restrict on update cascade
)engine=InnoDB default charset=utf8mb4;