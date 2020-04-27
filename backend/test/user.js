const user = require("../routes/users");
const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", user);

test("User route works", done => {
    request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect({ name: "maryjane" })
        .expect(200, done);
});

test("testing route works", done => {
    request(app)
        .post("users/add")
        .type("form")
        .send({ username: "peter" })
        .then(() => {
            request(app)
                .get("/add")
                .expect('User added!', done);
        });
});

