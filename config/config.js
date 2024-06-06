import dotenv from "dotenv"

dotenv.config()

const config = {
    verify_token : process.env.VERIFY_KEY,
    token : process.env.WHATSAPP_API_KEY,
    port : process.env.PORT,
    db_user : process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    db_name : process.env.DB_NAME, 
    db_host : process.env.DB_HOST, 
    db_port : process.env.DB_PORT, 
}

export default config