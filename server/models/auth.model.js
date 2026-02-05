const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
    default: "user",
  },
  metamaskId: {
    type: String,
  },
});

authSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
});
