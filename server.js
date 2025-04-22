console.log("Server is running on port 3000");
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const { encodePassword } = require('./hashedPasswords'); // Import the encodePassword function
const users = [];

app.post('/sign-up', (req, res) => {
    const { email, password } = req.body;
    
    // Validation checks
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password should be at least 8 characters long' });
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user with hashed password
    const hashedPassword = encodePassword(password);
    users.push({ email, password: hashedPassword });
    
    res.status(201).json({ message: 'User created successfully' });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});


app.post('/sign-in', (req, res) => {
    const { email, password } = req.body;
    
    // Validation checks
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
try {
        // Пошук користувача
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ message: "Uncorect email or password" });
        }

        // Перевірка пароля
        const hashedPassword = encodePassword(password);
        if (user.password !== hashedPassword) {
            return res.status(401).json({ message: "Uncorect email or password" });
        }

        // Генерація токена
        const token = generateToken(email);
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Внутрішня помилка сервера" });
    }
});