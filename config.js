const devConfig = {
	port: 1024,
	database: {
		DATABASE: 'finger_blog',
		USERNAME: 'node',
		PASSWORD: '',
		PORT: '3306',
		HOST: 'localhost'
	}
};
const prodConfig = {
	port: 1113,
	database: {
		DATABASE: 'finger_blog',
		USERNAME: 'nodeserver',
		PASSWORD: '',
		PORT: '3306',
		HOST: 'localhost'
	}
};
module.exports = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;