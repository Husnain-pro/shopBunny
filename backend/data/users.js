import bcrypt from 'bcryptjs';
const users = [
	{
		name: 'Admin user',
		email: 'admin@gmail.com',
		password: bcrypt.hashSync('admin1234', 10),
		isAdmin: true
	},
	{
		name: 'Hunny',
		email: 'Hunny@gmail.com',
		password: bcrypt.hashSync('hunny1234', 10),
		isAdmin: true
	},
	{
		name: 'humayun',
		email: 'humayun@gmail.com',
		password: bcrypt.hashSync('humayun1234', 10),
		isAdmin: true
	}
];

export default users;
