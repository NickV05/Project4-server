const { RequestHandler, Request, Response, NextFunction } = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const { pool } = require("../server");
const { MysqlError, PoolConnection} = require("mysql2");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "nikita.valovyy@gmail.com",
    pass: "aearbttnkredizgj"
  }
});

export const getBlogs: typeof RequestHandler = async (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  try {
    const umbrellaUrl = "https://expressapp.adaptable.app/forum/getblogs"; 
    const response = await axios.get(umbrellaUrl);
    const data = response.data;
    console.log("Response ===>", data);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTimeSlots: typeof RequestHandler = async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  const { date } = req.body;
  console.log("REQ.BODY ===>", req.body);
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);

  console.log("YEAR ===>", year);
  console.log("MONTH ===>", month);
  console.log("DAY ===>", day);

  pool.getConnection((err: typeof MysqlError, connection: typeof PoolConnection) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      next(err);
    } else {
      connection.query(
        'SELECT * FROM appoints WHERE year = ? AND month = ? AND day = ?',
        [year, month, day],
        (selectErr: typeof MysqlError, results: Array<object>) => {
          if (selectErr) {
            console.error('Error executing SELECT query: ', selectErr);
            connection.release();
            next(selectErr);
          } else {
            if (results.length === 0) {
              res.status(401).json({ message: "No appointments found for this date" });
              connection.release();
            } else {
              console.log("RESULTS ===>", results);
              res.status(200).json(results);
              connection.release();
            }
          }
        }
      );
    }
  });
};



export const ask: typeof RequestHandler = (req:typeof Request, res:typeof Response) => {
  console.log("RECEIVED BODY ===>", req.body);
  const { name, email, message } = req.body;

  const mailOptions = {
    from: `${name}, ${email}`,
    to: "nikita.valovyy@gmail.com",
    subject: "Project4",
    text: `From ${name}, ${email}. ${message}`
 };
 
 transporter.sendMail(mailOptions, function(error:any, info:any){
    if(error){
       console.log(error);
    }else{
       console.log("Email sent: " + info.response);
    }
 });

  res.status(200).json({ message: "Message received" });
};

export const subscribe:typeof RequestHandler = (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  console.log("REQ>BODY ====>", req.body);
  const { email } = req.body;
  if (!email || email.trim() === "") {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }
  pool.getConnection((err: typeof MysqlError, connection: typeof PoolConnection) => {
    if (err) {
      console.error('Error connecting to MySQL: ', err);
      next(err);
    } else {
      connection.query(
        'INSERT INTO emails (email) VALUES (?)',
        [email],
        (insertErr:typeof MysqlError) => {
          connection.release();

          if (insertErr) {
            console.error('Error inserting email into the database: ', insertErr);
            next(insertErr);
          } else {
            console.log("SUBSCRIBED EMAIL ===>", email);
            res.status(200).json({ message: "Email subscription successful." });
          }
        }
      );
    }
  });
};

export const confirm:typeof RequestHandler = (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  console.log("RECEIVED BODY ===>", req.body);
  const { time, service, doctorName, date, user } = req.body;
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  pool.getConnection((err: typeof MysqlError, connection: typeof PoolConnection) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      next(err);
    } else {
      connection.beginTransaction((beginTransactionErr: typeof MysqlError) => {
        if (beginTransactionErr) {
          console.error("Error beginning transaction: ", beginTransactionErr);
          connection.release();
          next(beginTransactionErr);
        } else {
          connection.query(
            "INSERT INTO appoints (date, year, month, servicetype, doctor, time, user) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [day, year, month, service, doctorName, time, user.email],
            (insertErr: typeof MysqlError, results:Array<object>) => {
              if (insertErr) {
                console.error("Error executing INSERT query: ", insertErr);
                connection.rollback(() => {
                  connection.release();
                  next(insertErr);
                });
              } else {
                connection.commit((commitErr: typeof MysqlError) => {
                  if (commitErr) {
                    console.error("Error committing transaction: ", commitErr);
                    connection.rollback(() => {
                      connection.release();
                      next(commitErr);
                    });
                  } else {
                    res.status(200).json({ message: "Appointment confirmed" });
                    connection.release();
                  }
                });
              }
            }
          );
        }
      });
    }
  });
};

export const reschedule:typeof RequestHandler = (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  console.log("RECEIVED BODY ===>", req.body);
  const { time, service, doctorName, date, user } = req.body;
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  pool.getConnection((err: typeof MysqlError, connection: typeof PoolConnection) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      next(err);
    } else {
      connection.beginTransaction((beginTransactionErr: typeof MysqlError) => {
        if (beginTransactionErr) {
          console.error("Error beginning transaction: ", beginTransactionErr);
          connection.release();
          next(beginTransactionErr);
        } else {
          connection.query(
            "UPDATE appoints SET date = ?, servicetype = ?, time = ?, year = ?, month = ? WHERE doctor = ? AND user = ?",
            [day, service, time, year, month, doctorName, user.email],
            (updateErr: typeof MysqlError, results:Array<object>) => {
              if (updateErr) {
                console.error("Error executing UPDATE query: ", updateErr);
                connection.rollback(() => {
                  connection.release();
                  next(updateErr);
                });
              } else {
                connection.commit((commitErr: typeof MysqlError) => {
                  if (commitErr) {
                    console.error("Error committing transaction: ", commitErr);
                    connection.rollback(() => {
                      connection.release();
                      next(commitErr);
                    });
                  } else {
                    res.status(200).json({ message: "Appointment changed" });
                    connection.release();
                  }
                });
              }
            }
          );
        }
      });
    }
  });
};

export const cancel:typeof RequestHandler = (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  const { id } = req.params;

  pool.getConnection((err: typeof MysqlError, connection: typeof PoolConnection) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      next(err);
    } else {
      connection.beginTransaction((beginTransactionErr: typeof MysqlError) => {
        if (beginTransactionErr) {
          console.error("Error beginning transaction: ", beginTransactionErr);
          connection.release();
          next(beginTransactionErr);
        } else {
          console.log("TRANSACTION STARTED");
          const query = "DELETE FROM appoints WHERE id = ?";
          connection.query(query, [id], (deleteErr: typeof MysqlError, results:Array<object>) => {
            if (deleteErr) {
              console.error("Error executing SELECT query: ", deleteErr);
              connection.release();
              next(deleteErr);
            } else {
              console.log("Appointment cancelled");
              res.status(200).json({ message: "Appointment cancelled" });
              connection.release();
            }
          });
        }
      });
    }
  });
};

export const getAppointments:typeof RequestHandler = (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  const { id } = req.params;
  pool.getConnection((err:typeof MysqlError, connection:typeof PoolConnection) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      next(err);
    } else {
      connection.beginTransaction((beginTransactionErr:typeof MysqlError) => {
        if (beginTransactionErr) {
          console.error("Error beginning transaction: ", beginTransactionErr);
          connection.release();
          next(beginTransactionErr);
        } else {
          console.log("TRANSACTION STARTED");
          connection.query(
            "SELECT * FROM users WHERE id = ? ",
            [id],
            (selectErr:typeof MysqlError, results:any) => {
              if (selectErr) {
                console.error("Error executing SELECT query: ", selectErr);
                connection.release();
                next(selectErr);
              } else {
                if (results.length === 0) {
                  res.status(401).json({ message: "No user found" });
                  console.log("NO USER FOUND");
                  connection.release();
                } else {
                  console.log("RESULTS ===>", results);
                  connection.query(
                    "SELECT * FROM appoints WHERE user = ? ",
                    [results[0].email],
                    (selectErr:typeof MysqlError, appointResults:Array<object>) => {
                      if (selectErr) {
                        console.error(
                          "Error executing SELECT query: ",
                          selectErr
                        );
                        connection.release();
                        next(selectErr);
                      } else {
                        if (appointResults.length === 0) {
                          res.status(200).json([]);
                          console.log("NO APPOINTS FOUND");
                          connection.release();
                        } else {
                          console.log(
                            "APPOINTMENT RESULTS ===>",
                            appointResults
                          );
                          res.status(200).json(appointResults);
                          connection.release();
                        }
                      }
                    }
                  );
                }
              }
            }
          );
        }
      });
    }
  });
};

export const getAppoint:typeof RequestHandler = (req:typeof Request, res:typeof Response, next:typeof NextFunction) => {
  const { id } = req.params;

  pool.getConnection((err:typeof MysqlError, connection:typeof PoolConnection) => {
    if (err) {
      console.error("Error connecting to MySQL: ", err);
      next(err);
    } else {
      connection.beginTransaction((beginTransactionErr:typeof MysqlError) => {
        if (beginTransactionErr) {
          console.error("Error beginning transaction: ", beginTransactionErr);
          connection.release();
          next(beginTransactionErr);
        } else {
          console.log("TRANSACTION STARTED");
          connection.query(
            "SELECT * FROM appoints WHERE id = ? ",
            [id],
            (selectErr:typeof MysqlError, results:Array<object>) => {
              if (selectErr) {
                console.error("Error executing SELECT query: ", selectErr);
                connection.release();
                next(selectErr);
              } else {
                if (results.length === 0) {
                  res.status(401).json({ message: "No appoints found" });
                  connection.release();
                } else {
                  console.log("RESULTS ===>", results);
                  res.status(200).json(results);
                  connection.release();
                }
              }
            }
          );
        }
      });
    }
  });
};



