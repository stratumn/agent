/**
 * An express middleware that handles errors.
 * @returns {function} an express middleware.
 */
export default function error() {
  /*eslint-disable*/
  return (err, req, res, next) => {
  /*eslint-enable*/
    if (err.status && err.status !== 500) {
      console.error(`${req.originalUrl}: ${err.stack}`);
      res.status(err.status).json({ link: {}, meta: { errorMessage: err.message } });
      return;
    }

    console.error(`${req.originalUrl}: ${err.stack}`);

    res.status(500).json({ link: {}, meta: { errorMessage: 'internal server error' } });
  };
}
