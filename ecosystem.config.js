
module.exports = {
    apps: [
        {
            name: "ciudad-anuncios",
            script: "npm",
            args: "start",
            env: {
                PORT: 3000,
                NODE_ENV: "production",
            },
        },
    ],
};
