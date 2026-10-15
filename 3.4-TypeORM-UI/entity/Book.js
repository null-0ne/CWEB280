const { EntitySchema } = require("typeorm");

module.exports.Book = new EntitySchema({
  name: "Book",
  tableName: "books",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    // NO NOT store data you can calculate:
    isAvailable: {
      type: "boolean",
      default: true,
    },
  },
});
