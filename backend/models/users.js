const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/users.json");

class UserModel {
  constructor(id, name, username, password, userType) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.userType = userType;
  }

  static loadUsers() {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        return [];
      }
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data) || [];
    } catch (error) {
      console.error("Error reading users data:", error.message);
      return [];
    }
  }

  // Get all users
  static getAllUsers() {
    return this.loadUsers();
  }

  // Get a user by ID
  static getUserById(userId) {
    return this.loadUsers().find((user) => user.id === userId) || null;
  }
  static getAllStudents() {
    return this.loadUsers().filter((user) => user.userType.includes("student"));
  }
}

module.exports = UserModel;
