module.exports = app => {
    /* Rota para retornar informações do usuário */
    app.route('/users')
        .post(app.api.user.saveUser)
        .get(app.api.user.getUsers)

    
    app.route('/users/:id')
        .put(app.api.user.saveUser)
        .get(app.api.user.getUserById);
    
    app.route('/categories')
        .post(app.api.category.saveCategory)
        .get(app.api.category.getCategories);

    app.route('/categories/:id')
        .put(app.api.category.saveCategory)
        .get(app.api.category.getCategoryById);
}