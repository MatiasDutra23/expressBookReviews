const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

// Configurar la sesión
app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

const validateToken = (req, res, next) => {
  // Obtener el token de la solicitud
  const token = req.headers.authorization;

  // Verificar si se proporcionó un token
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  // Verificar y decodificar el token JWT
  jwt.verify(token, "secret_key", function (err, decoded) {
    if (err) {
      // Si hay un error al decodificar el token, devolver un mensaje de error
      return res.status(401).json({ message: "Invalid token" });
    } else {
      // Si el token es válido, pasar al siguiente middleware o ruta
      req.decoded = decoded; // Agregar el objeto decodificado a la solicitud
      next();
    }
  });
};

// Endpoint para verificar y decodificar el token JWT
app.post("/verify-token", (req, res) => {
  const token = req.body.token;

  // Verificar si se proporcionó un token
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // Verificar y decodificar el token JWT
  jwt.verify(token, "secret_key", function (err, decoded) {
    if (err) {
      // Si hay un error al decodificar el token, devolver un mensaje de error
      return res.status(401).json({ message: "Invalid token" });
    } else {
      // Si el token es válido, devolver la información decodificada del token
      return res.status(200).json({ decoded: decoded });
    }
  });
});

const PORT = 5000;

// Aplicar el middleware validateToken a las rutas relacionadas con /auth
app.use("/customer/auth", validateToken);

// Rutas de autenticación para usuarios registrados
app.use("/customer", customer_routes);

// Rutas públicas
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
