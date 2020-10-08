// imports

module.exports = {
    index(req, res) {
        return res.render("home/index");
    },
    about(req, res) {
        return res.render("home/about");
    }
}