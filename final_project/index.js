const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configurar la sesión
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware de autenticación
app.use("/customer/auth/*", function auth(req, res, next) {
    // Verificar si el usuario tiene un token JWT válido en la sesión
    const token = req.session.token;
    if (token) {
        // Verificar el token JWT
        jwt.verify(token, "secret_key", function(err, decoded) {
            if (err) {
                // El token no es válido, redirigir al usuario al inicio de sesión
                return res.status(401).json({ message: "Unauthorized" });
            } else {
                // El token es válido, permitir el acceso a la ruta
                next();
            }
        });
    } else {
        // No se encontró ningún token en la sesión, redirigir al usuario al inicio de sesión
        return res.status(401).json({ message: "Unauthorized" });
    }
});

const PORT = 5000;

// Rutas de autenticación para usuarios registrados
app.use("/customer", customer_routes);

// Rutas públicas
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
