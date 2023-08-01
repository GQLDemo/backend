const Todo = require("../models/Todo");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");
const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    complete: {
      type: GraphQLBoolean,
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    todos: {
      type: new GraphQLList(TodoType),
      resolve(parent, args) {
        return Todo.find();
      },
    },
    todo: {
      type: TodoType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          const todo = await Todo.findById(args.id);
          if (!todo) throw new Error("Todo Not Found");
          return todo;
        } catch (err) {
          throw new Error("Error finding todo: " + err.message);
        }
      },
    },
  },
});
// Mutations Query
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTodo: {
      type: TodoType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        try {
          const todo = new Todo({
            name: args.name,
            complete: false,
          });
          await todo.save();
          return todo;
        } catch (err) {
          throw new Error("Error creating todo: " + err.message);
        }
      },
    },
    deleteTodo: {
      type: TodoType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          const todo = await Todo.findByIdAndRemove(args.id);
          if (!todo) {
            throw new Error("Failed to delete, todo Not Found");
          }
          return todo;
        } catch (err) {
          throw new Error("Error deleting todo: " + err.message);
        }
      },
    },
    toggleTodo: {
      type: TodoType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      async resolve(parent, args) {
        try {
          const todo = await Todo.findById(args.id);
          if (!todo) {
            throw new Error("Todo not found");
          }
          todo.complete = !todo.complete;
          await todo.save();

          return todo;
        } catch (err) {
          throw new Error("Error toggling todo: " + err.message);
        }
      },
    },
    updateTodo: {
      type: TodoType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          const todo = await Todo.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name,
              },
            },
            { new: true }
          );
          if (!todo) {
            throw new Error("Todo not found");
          }
          return todo;
        } catch (err) {
          throw new Error("Error toggling todo: " + err.message);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: mutation });
