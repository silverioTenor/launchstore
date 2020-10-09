// imports

module.exports = {
    about(req, res) {
        return res.render("home/about");
    },
    exchange(req, res) {
        return res.render("home/exchangeAndReturn");
    },
    privacy(req, res) {
        return res.render("home/privacy");
    }
}