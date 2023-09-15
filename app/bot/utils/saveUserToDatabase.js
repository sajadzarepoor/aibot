const UserDatabase = require("../../../model/users");

const saveUserToDatabase = async (ctx) => {
  const userInfo = ctx.message.from;
  let user = await UserDatabase.findOne({ id: userInfo.id });
  if (!user) {
    user = new UserDatabase({
      name: ctx.message.from.first_name,
      username: ctx.message.from.username,
      id: ctx.message.from.id,
      config: false,
    });
  }
  await user.save();
  console.log(ctx.message.from.first_name, " : saved");
};
module.exports = saveUserToDatabase;
