const express = require('express');
const multer = require('multer');
const contacts = require('./data');

const PORT = 3000;
const app = express();

const storage = multer.diskStorage({
    filename: (_, file, cb) => {
        cb(
            null,
            `${new Date().getTime()}_${Math.random() * 1000}.${file.mimetype
                .split('/')
                .at(-1)}`,
        );
    },
    destination: './uploads',
});
const upload = multer({
    limits: {
        fieldSize: 2000000,
    },
    fileFilter: (_, file, cb) => {
        const fileTypes = /png|jpeg|jpg|gif$/;

        const { originalname, mimetype } = file;

        if (
            fileTypes.test(originalname.toLowerCase()) &&
            fileTypes.test(mimetype.toLowerCase())
        )
            return cb('', true);

        cb('Error: Only accept file image!');
    },
    storage,
});

app.use(express.static('./templates'));
app.use(express.static('./uploads'));
app.set('view engine', 'ejs');
app.set('views', './templates');

app.get('/', (_, res) => {
    res.render('index', { contacts });
});

app.post('/add', upload.single('avatar'), (req, res) => {
    contacts.push({
        ...req.body,
        avatar: `/${req.file.filename}`,
    });

    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}...`));
