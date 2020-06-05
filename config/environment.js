

const development = {
    name: '*****',
    asset_path: './assets',
    session_cookie_key: '*****',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: "******",
          pass: "*******"
        }
    },
    google_client_id: "***********",
    google_client_secret: "**********",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: '******l',
    
}


const production = {
    name: 'production'
}



module.exports = development;