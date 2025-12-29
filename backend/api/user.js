const bcrypt = require('bcrypt-nodejs');


module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;
    const encrtyptPassword = password => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }


    const saveUser = async(req, res) => {
        
        const user = { ...req.body };
        if(req.params.id) user.id = req.params.id;
        try{
            // usando as validações do validation.js para verificar os dados do usuário
            existsOrError(user.name, 'Nome não informado');
            existsOrError(user.email, 'E-mail não informado');
            existsOrError(user.password, 'Senha não informada');
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida');
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem');

            // pega usuario do banco de dados para verificar se já existe
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first();
            if(!user.id){
                notExistsOrError(userFromDB, 'Usuário já cadastrado');
            }

        }catch(msg){
            return res.status(400).send(msg);
        }
        user.password = encrtyptPassword(user.password);
        delete user.confirmPassword;
        if(user.id){// se usuario ja existe, realizar apenas a atualização dos dados
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
        } else { // se não existe, realizar o cadastro
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
        }
    }

    // pegar todos os usuários do banco de dados
    const getUsers = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err));

    }

    return { saveUser };
}