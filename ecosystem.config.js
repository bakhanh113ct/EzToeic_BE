module.exports = {
    apps: [
        {
            name: 'EzToeic_BE',
            script: './dist/index.js',
            env: {
                PORT:8000,
                ACCESS_TOKEN_SECRET:'khanh',
                REFRESH_TOKEN_SECRET:'refresh',
                REDIS_URL:'rediss://red-clllogb8772c73fdao00:Uwmv4z9BpXI54fqtuVJGJJPOIW4ThZ8o@singapore-redis.render.com:6379',
                DATABASE_HOST:'dpg-ckju62pjrl0c73fq6pj0-a.singapore-postgres.render.com',
                DATABASE_PORT:5432,
                DATABASE_USERNAME:'eztoeic_user',
                DATABASE_PASSWORD:'fLVFqX9xzNaifgQbx8opNoEILPCrKOwf',
                DATABASE_NAME:'eztoeic',
            },
        },
    ],
};