require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(
    cors({
      origin: [process.env.CLIENT_URI]  
    })
  );

  // const usersRouter = require('./routes/users');
// const authRouter = require('./routes/auth');
// const itemsRouter = require('./routes/items');
// const cartRouter = require('./routes/cart')
// const stripeRouter = require('./routes/stripe')


app.get("/", (req: any, res: { send: (arg0: string) => void; } ) => {
    res.send("Hello world!!");
  })

// app.use('/users', usersRouter);
// app.use('/auth', authRouter);
// app.use('/items', itemsRouter);
// app.use('/cart', cartRouter)
// app.use('/stripe', stripeRouter)


export default app