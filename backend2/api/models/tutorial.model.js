const bcrypt = require("bcrypt");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  // Hash the password before saving the user
  schema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  });


  // Add a method to verify the password
  schema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Tutorial = mongoose.model("tutorial", schema);
  return Tutorial;
};
