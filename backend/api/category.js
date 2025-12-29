module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

    const saveCategory  = async (req, res) => {
        const category = { ...req.body };
        if (req.params.id) category.id = req.params.id;
        try {
            // usando as validações do validation.js para verificar os dados da categoria
            existsOrError(category.name, 'Nome da categoria não informado');
        } catch (msg) {
            return res.status(400).send(msg);
        } 
        if (category.id) { // se categoria ja existe, realizar apenas a atualização dos dados
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(200).send())
                .catch(err => res.status(500).send(err));
        } else { // se não existe, realizar o cadastro
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
        }
    }

    const getCategories = (req, res) => {
        app.db('categories')
            .select('id', 'name')
            .then(categories => res.json(categories))
            .catch(err => res.status(500).send(err));
    }

    const getCategoryById = (req, res) => {
        const id = req.params.id;
        app.db('categories')
            .select('id', 'name')
            .where({ id })
            .then(categories => res.json(categories))
            .catch(err => res.status(500).send(err));
    }

    return { saveCategory, getCategories, getCategoryById };
}