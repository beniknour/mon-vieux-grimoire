

const validateEmailFormat = (req, res, next) => {
    const email = req.body.email;
    const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Vérification du format de l'e-mail
    if (!email || !email.match(emailFormat)) {
        return res.status(400).json({ error: 'Format d\'adresse e-mail invalide.' });
    }

    next();
};

module.exports = validateEmailFormat;
