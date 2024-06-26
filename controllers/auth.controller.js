import { createUser, loginUser, recoverPassword } from "../models/user.js";
import { encrypt, compare } from "../helpers/handleBcrypt.js";
import { encryptCrypto, decryptCrypto } from "../helpers/handleCrypto.js";

export const registerUser = async (req, res) => {
  let { id, name, password, role, email, phone} = req.body;
  //son promesas y por eso el await
  name = await encryptCrypto(name);
  email = await encryptCrypto(email);
  phone = await encryptCrypto(phone);

  const encriptedPassword = await encrypt(password);
  const registeredUser = await createUser({
    id,
    name,
    encriptedPassword,
    role,
    email,
    phone,
  });
  if (!registeredUser) return res.status(400).json({ message: "error al registrar usuario" });
  return res.status(200).json({ message: "OK" });
};

export const logUser = async (req, res) => {
  const { id, password } = req.body;
  const loggedUser = await loginUser({
    id,
  });

  if (!loggedUser)
    return res.status(400).json({ message: "error al loggear usuario" });
  const validPassword = await compare(password, loggedUser.password);
  if (!validPassword)
    return res.status(400).json({ message: "error al logear usuario pass" });
  return res.status(200).json({
    response: {
      role: loggedUser.role,
    },
  });
};

export const recoverPass = async (req, res) => {
  let { id, password, passwordRepeat} = req.body;
  if(password != passwordRepeat) return res.status(400).json({ message: "error al cambiar clave" }); 
  const encriptedPassword = await encrypt(password);
  const response  = await recoverPassword({id,encriptedPassword})
  if (!response) return res.status(400).json({ message: "error al cambiar clave" });
  return res.status(200).json({ message: "OK" });
};


