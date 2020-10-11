// imports

module.exports = {
    index(req, res) {
        return res.render("products/index");
    },
    create(req, res) {},
    post(req, res) {},
    show(req, res) {
        return res.render("products/show");
    },
    update(req, res) {},
    put(req, res) {},
    delete(req, res) {},
}