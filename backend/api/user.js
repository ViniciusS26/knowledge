module.exports = app => {
    const saveUser = (req, res) => {
        res.send('User saved successfully!');
    }

    return { saveUser };
}