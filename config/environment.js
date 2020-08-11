

const development = {
    name: '*****',
    asset_path: './assets',
    session_cookie_key: '*****',
    db: '******',
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: "*******",
          pass: "********"
        }
    },
    google_client_id: "********",
    google_client_secret: "******",
    google_call_back_url: "******",
    jwt_secret: '****',
    
}


const production = {
    name: 'production'
}



module.exports = development;