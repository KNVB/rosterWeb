import dotenv from 'dotenv';
dotenv.config({ path: '.env.' + process.env.NODE_ENV });
export const DbConfig = {
	charset: process.env["DATABASE_CHARSET"],
	database: process.env["DATABASE_NAME"],
	host: process.env["DATABASE_HOST"],
	insecureAuth:true,	
	multipleStatements:true,
	password: process.env["DATABASE_PASSWORD"],
	port: process.env["DATABASE_PORT"],
	user: process.env["DATABASE_USER_NAME"]	
}