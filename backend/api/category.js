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
                .then(_ => res.status(200).send())
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

        app.db('categories')
            .select('id', 'name')
            .where({ id:  req.params.id })
            .first()
            .then(categories => res.json(categories))
            .catch(err => res.status(500).send(err));
    }

    const withPath = categories =>{
        const getParent = (categories, parentId) =>{
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category =>{
            let path = category.name
            let parent = getParent(categories, category.parentId)

            while(parent){
                path = `${parent.name} > ${path} `
                parent = getParent(categories, parent.parentId)
            }

            return {...category, path}
        })

        categoriesWithPath.sort((a,b)=>{
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    const toTree = (categories, tree) =>{
        if(!tree) tree = categories.filter(c => !c.parentId)
        
        tree = tree.map(parentNode =>{
            const isChild = node => node.parentId == parentNode.id
            parentNode.children =  toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) =>{
        app.db('categories')
            .then(categories => res.json(toTree(withPath(categories))))
            .catch(err => res.status(500).send(err))
    }

    return { saveCategory, getCategories, getCategoryById, getTree};
}