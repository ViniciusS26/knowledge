module.exports = app => {
    /* Rota para retornar informações do usuário */
    app.route('/users').post(app.api.user.saveUser);

}