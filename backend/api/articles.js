module.exports = app =>{
    const {existsOrError, notExistsOrError} = app.api.validation;


    const saveArticles = (req, res) =>{
        const article = {...req.body}

        if(req.params.id) article.id = req.params.id;

        try{
            existsOrError(article.name, 'Nome não informado');
            existsOrError(article.description, 'Descrição não informada');
            existsOrError(article.categoryId, 'Categoria não informada');
            existsOrError(article.userId, 'Autor não informado');
            existsOrError(article.content, 'Conteudo não informado');
        }catch(msg){
            res.status(400).send(msg)
        }

       
        if(article.id){
            app.db('articles')
                .update(article)
                .where({id:article.id})
                .then(_ => res.status(200).send())
                .catch(err => res.status(500).send(err))
        }else{
            app.db('articles')
                .insert(article)
                .then(_ => res.status(200).send())
                .catch(err => res.status(500).send(err));
        }

    }

    const getArticlesById = (req, res)=>{

        app.db('articles')
            .select('id', 'name', 'description','imageUrl','content')
            .where({id: req.params.id})
            .first()
            .then(articles => {
                articles.content = articles.content.toString()
                return res.json(articles)
            })
            .catch(err => res.status(500).send(err));
    }


    const getAllArticles = (req, res) =>{
        app.db('articles')
            .select('id', 'name', 'description','imageUrl','content')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err));

    }


    const removeArticle =  async(req, res) =>{
        try{
            const rowsDelete = await app.db('articles').where({id: req.params.id}).del();

            existsOrError(rowsDelete, 'Artigo não encontrado.');
            res.status(200).send();
        }catch(msg){
            res.status(500).send(msg)
        }
    }

    const limit = 10;
    const getPage = async(req, res)=>{
        const page = req.query.page || 1

        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count)

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.json({data: articles, count, limit }))
            .catch(err => res.status(500).send(err))
    }

    return {saveArticles, getArticlesById, getAllArticles, removeArticle, getPage}
}