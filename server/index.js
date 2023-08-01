const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./config/db");
const port = process.env.PORT || 8000;
const schema = require("./schema/schema");
const app = express();
connectDB();
app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
app.listen(port, console.log(`Server running on port ${port}`));
